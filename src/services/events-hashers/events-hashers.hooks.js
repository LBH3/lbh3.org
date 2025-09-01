const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');
const errors = require('@feathersjs/errors');
const getBoredHasher = require('../../utils/get-bored-hasher');

const afterFindHook = function(hook) {
  return shouldFilterData(hook).then(filter => {
    const hashers = hook.result.data;
    if (filter < filterStates.BORED) {
      hook.result.data = hashers.map(hasher => {
        return filterData(hasher, filter);
      });
    }
  });
};

const afterGetHook = function(hook) {
  return shouldFilterData(hook).then(filter => {
    hook.result = filterData(hook.result, filter);
  });
};

const boredPositions = [
  authHook.GRANDMASTERS,
  authHook.HASH_CASH,
  authHook.HASH_HISTORIANS,
  authHook.ON_DISK,
  authHook.ON_SEC,
  authHook.RECYCLEMEISTERS,
  authHook.TRAILMASTERS,
  authHook.WEBMASTERS
];

const filterData = function(data, filterState) {
  if (filterState === filterStates.BORED) {
    return data;
  } else {
    const allowedFields = filterState === filterStates.VERIFIED ? [
      'createdAt',
      'hashName',
      'hasherId',
      'id',
      'role',
      'trailNumber',
      'updatedAt'
    ] : [
      'createdAt',
      'id',
      'trailNumber',
      'updatedAt'
    ];
    const filteredFields = {};
    allowedFields.forEach(field => {
      filteredFields[field] = data[field];
    });
    if (!filteredFields.hashName) {
      if (data.givenName) {
        filteredFields.givenName = data.givenName;
      } else {
        filteredFields.familyName = data.familyName;
      }
    }
    return filteredFields;
  }
};

const filterStates = {
  UNVERIFIED: 1,
  VERIFIED: 2,
  BORED: 3
};

const getFirstOrLastTrailForHasher = function(sequelize, hasherId, first) {
  const sortDirection = first ? 'ASC' : 'DESC';
  const query = `SELECT events.* FROM events_hashers INNER JOIN events ON (events_hashers.trail_number = events.trail_number) WHERE hasher_id=${hasherId} ORDER BY events.start_datetime ${sortDirection} LIMIT 2`;
  return sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT
  });
};

const getFirstAndLastTrailData = function({event, hasher, hook}) {
  return new Promise(function(resolve, reject) {
    const sequelizeClient = hook.app.get('sequelizeClient');
    getFirstOrLastTrailForHasher(sequelizeClient, hasher.id, true).then(firstTrails => {
      let newFirstTrail;
      if (firstTrails.length) {
        newFirstTrail = (firstTrails[0].start_datetime.getTime() === event.startDatetime.getTime()) ? firstTrails[1] : firstTrails[0];
      }
      getFirstOrLastTrailForHasher(sequelizeClient, hasher.id).then(lastTrails => {
        let newLastTrail;
        if (lastTrails.length) {
          newLastTrail = (lastTrails[0].start_datetime.getTime() === event.startDatetime.getTime()) ? lastTrails[1] : lastTrails[0];
        }
        resolve({
          newFirstTrail,
          newLastTrail
        });
      }, reject);
    }, reject);
  });
};

const getRequiredData = function(hook) {
  return new Promise(function(resolve, reject) {
    new Promise((internalResolve, internalReject) => {
      if (hook.data.hasherId) {
        internalResolve(hook.data);
      } else {
        hook.service.get(hook.id, hook.params).then(internalResolve, internalReject);
      }
    }).then(eventHasher => {
      const findParams = Object.assign({}, hook.params, {
        query: {
          trailNumber: eventHasher.trailNumber
        }
      });
      hook.app.service('api/events').find(findParams).then(events => {
        hook.app.service('api/hashers').get(eventHasher.hasherId, hook.params).then(hasher => {
          resolve({
            event: events.data[0],
            hasher
          });
        }, reject);
      }, reject);
    }, reject);
  });
};

const createHook = function(hook) {
  return new Promise(function(resolve, reject) {
    getRequiredData(hook).then(({event, hasher}) => {
      let firstTrailDate;
      let firstTrailNumber;
      if (!hasher.firstTrailDate || new Date(hasher.firstTrailDate) > event.startDatetime) {
        // No first trail date or it’s after this event, so use this event’s info
        firstTrailDate = event.startDatetime;
        firstTrailNumber = event.trailNumber;
      } else {
        // Hasher’s first trail on record is before this event, so use what’s on record
        firstTrailDate = hasher.firstTrailDate;
        firstTrailNumber = hasher.firstTrailNumber;
      }

      const lastTrailDate = (!hasher.lastTrailDate || new Date(hasher.lastTrailDate) < event.startDatetime) ? event.startDatetime : hasher.lastTrailDate;

      const hasherPatchData = {
        firstTrailDate,
        firstTrailNumber,
        lastTrailDate,
        runCount: Number(hasher.runCount) + 1
      };
      hook.app.service('api/hashers').patch(hasher.id, hasherPatchData).then(() => {
        resolve(hook);
      }, reject);
    }, reject);
  });
};

const removeHook = function(hook) {
  return new Promise(function(resolve, reject) {
    getRequiredData(hook).then(({event, hasher}) => {
      getFirstAndLastTrailData({event, hasher, hook}).then(({newFirstTrail, newLastTrail}) => {
        const hasherPatchData = {
          firstTrailDate: (newFirstTrail) ? newFirstTrail.start_datetime : null,
          firstTrailNumber: (newFirstTrail) ? newFirstTrail.trail_number : null,
          lastTrailDate: (newLastTrail) ? newLastTrail.start_datetime : null,
          runCount: Number(hasher.runCount) - 1
        };
        hook.app.service('api/hashers').patch(hasher.id, hasherPatchData).then(() => {
          resolve(hook);
        }, reject);
      }, reject);
    }, reject);
  });
};

const restrictHook = function(hook) {

  // Skip this hook if it’s an internal call
  if (!hook.params.provider) {
    return hook;
  }

  // Check that the user is authenticated
  const user = hook.params.user;
  if (!user || !user.hasherId) {
    throw new errors.NotAuthenticated('You are not authenticated.');
  }

  // Check if the user is requesting their own info
  if (hook.params.query.hasherId == user.hasherId) {
    return hook;
  }

  // Check if the user is querying for a run they attended
  const query = hook.params.query;
  const trailNumberQuery = query.trailNumber;
  if (!query.hasherId && trailNumberQuery) {
    return new Promise((resolve, reject) => {
      hook.service.find({
        query: {
          hasherId: user.hasherId,
          trailNumber: trailNumberQuery
        }
      }).then(result => {
        if (result.total === 1) {
          resolve(hook);
        } else if (query.role && trailNumberQuery.$gte && trailNumberQuery.$lte) {
          // Query for hashits & scribes for an election ballot
          resolve(hook);
        } else {
          resolve(restrictToBored(hook));
        }
      }, reject);
    });
  }

  return restrictToBored(hook);
};

const restrictToBored = authHook.restrictToUserOrPositions({}, ...boredPositions);

const shouldFilterData = function(hook) {
  return new Promise(function(resolve) {
    const user = hook.params.user;
    if (user) {
      const hasherId = hook.result ? hook.result.id : null;
      if (hasherId === user.hasherId) {
        // Ok to not filter the data and include the hasher’s mileage
        resolve(filterStates.BORED);
      } else {
        getBoredHasher(hook.app, user).then(boredHashers => {
          const found = boredHashers.data.find(boredHasher => {
            return boredPositions.includes(boredHasher.positionId);
          });
          resolve(found ? filterStates.BORED : (user.hasherId ? filterStates.VERIFIED : filterStates.UNVERIFIED));
        }, () => {
          resolve(user.hasherId ? filterStates.VERIFIED : filterStates.UNVERIFIED);
        });
      }
    } else {
      resolve(filterStates.UNVERIFIED);
    }
  });
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ restrictHook ],
    get: [ restrictHook ],
    create: [ authHook.restrictTo(...boredPositions), createHook ],
    update: [ authHook.restrictTo() ],
    patch: [ authHook.restrictTo() ],
    remove: [ authHook.restrictTo(...boredPositions), removeHook ]
  },

  after: {
    all: [],
    find: [ afterFindHook ],
    get: [ afterGetHook ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
