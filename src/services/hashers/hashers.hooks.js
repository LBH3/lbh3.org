/*eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');
const errors = require('@feathersjs/errors');
const getBoredHasher = require('../../utils/get-bored-hasher');
const jwtAuthentication = authenticate('jwt');
const makeRaw = require('../../utils/make-raw');
const searchHook = require('../../hooks/search');

const filterStates = {
  UNVERIFIED: 1,
  VERIFIED: 2,
  BORED: 3
};

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

const beforeFindHook = function(hook) {
  return shouldFilterData(hook).then(filter => {
    if (filter === filterStates.BORED) {
      return searchHook({
        fields: ['emails', 'family_name', 'given_name', 'hash_name'],
        oldOptions: {
          fields: ['familyName', 'givenName', 'hashName']
        }
      })(hook);
    } else {
      return searchHook({
        fields: ['death_date', 'hash_name'],
        oldOptions: {
          fields: ['hashName']
        }
      })(hook);
    }
  });
};

const afterFindHook = function(hook) {
  return shouldFilterData(hook).then(filter => {
    if (filter < filterStates.BORED) {
      hook.result.data = hook.result.data.map(hasher => {
        return filterData(hasher, filter, hook.params.user);
      });
    }
    const sequelizeClient = hook.app.get('sequelizeClient');

    const sequentialPromise = hook.result.data.reduce((promise, hasher) => {
      return promise.then(() => {
        return addStatsToHasher(hasher, sequelizeClient);
      });
    }, Promise.resolve());
    return sequentialPromise.then(() => {
      return hook;
    });
  });
};

const updateHookResultWithHasherStats = function(hook) {
  return new Promise(function(resolve) {
    const sequelizeClient = hook.app.get('sequelizeClient');
    addStatsToHasher(hook.result, sequelizeClient).then(() => {
      resolve(hook);
    }, error => {
      console.error(`Failed to fetch stats for hasher #${hook.result.id} with error:`, error);
      resolve(hook);
    });
  });
};

const afterGetHook = function(hook) {
  return shouldFilterData(hook).then(filter => {
    hook.result = filterData(hook.result, filter);
    if (filter === filterStates.BORED || filter === filterStates.VERIFIED) {
      return updateHookResultWithHasherStats(hook);
    }
  });
};

const addStatsToHasher = function(hasher, sequelize) {
  return new Promise((resolve, reject) => {
    const query = `
      (SELECT COUNT(id) FROM events_hashers WHERE hasher_id=${hasher.id} AND role ILIKE 'hare%')
      UNION ALL
      (SELECT COUNT(id) FROM events_hashers WHERE hasher_id=${hasher.id})
      UNION ALL
      (SELECT SUM(events.miles) FROM events_hashers INNER JOIN events ON (events_hashers.trail_number = events.trail_number) WHERE hasher_id=${hasher.id})
    `;
    sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    }).then(result => {
      if (result && result[0]) {
        hasher.dataValues = hasher.dataValues || {};
        hasher.hareCount = hasher.dataValues.hareCount = parseFloat(result[0].count) || 0;
        hasher.runCount = hasher.dataValues.runCount = parseFloat(result[1].count) || 0;
        hasher.runMileage = hasher.dataValues.runMileage = parseFloat(result[2].count) || 0;
      }
      resolve(hasher);
    }, reject);
  });
};

const attachAuthInfo = function(hook) {
  return new Promise(function(resolve) {
    jwtAuthentication(hook).then(() => {
      resolve(hook);
    }, () => {
      resolve(hook);
    });
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

const createAndUpdateFields = function(hook) {
  return new Promise((resolve, reject) => {
    if (hook.method === 'create') {
      resolve({});
    } else {
      hook.app.service('api/hashers').get(hook.id, {user: hook.params.user}).then(resolve, reject);
    }
  }).then(hasher => {

    // Restrict what hashers can edit in their own profile
    if (hook.id == hook.params.user.hasherId && !hook.params.user.canEditHasherInfo) {
      const whitelist = [
        'addresses',
        'birthDay',
        'birthDayPrivacy',
        'birthMonth',
        'birthMonthPrivacy',
        'birthYear',
        'birthYearPrivacy',
        'emails',
        'familyName',
        'familyNamePrivacy',
        'givenName',
        'givenNamePrivacy',
        'headshotPrivacy',
        'headshotUrl',
        'motherHash',
        'motherHashPrivacy',
        'phones',
        'whoMadeYouCum',
        'whoMadeYouCumPrivacy'
      ];
      const filteredData = Object.assign({}, hasher);
      whitelist.forEach(field => {
        filteredData[field] = hook.data[field];
      });
      hook.data = filteredData;
    }

    // Created & updated fields
    const profile = hook.params.user.facebookProfile || hook.params.user.googleProfile || {};
    let displayName = profile.displayName || '';
    if (!displayName) {
      if (typeof profile.name === 'object') {
        const familyName = profile.name.familyName || '';
        const givenName = profile.name.givenName || '';
        displayName = `${givenName} ${familyName}`.trim();
      }
      if (!displayName && profile.emails && profile.emails.length > 0) {
        const firstEmail = profile.emails[0];
        if (firstEmail && firstEmail.value) {
          displayName = firstEmail.value;
        }
      }
    }
    if (hook.method === 'create' && !hook.data.createdBy && !hook.data.createdByUserId) {
      hook.data.createdBy = displayName;
      hook.data.createdByUserId = hook.params.user.id || 0;
    }
    hook.data.updatedBy = displayName;
    hook.data.updatedByUserId = hook.params.user.id || 0;

    // Naming trail
    if (hook.params.user.canEditHasherInfo) {
      const namingTrailNumber = hook.data.namingTrailNumber;
      if (namingTrailNumber) {
        return new Promise(function(resolve, reject) {
          const findEvent = {query: {trailNumber: namingTrailNumber}};
          hook.app.service('api/events').find(findEvent).then(events => {
            if (events.data.length === 1) {
              hook.data.namingTrailDate = events.data[0].startDatetime;
              resolve(hook);
            } else {
              reject(new errors.NotFound(`Could not find trail #${namingTrailNumber}`));
            }
          }, reject);
        });
      } else if (hook.data.namingTrailDate) {// Reset namingTrailDate if namingTrailNumber is not set
        hook.data.namingTrailDate = null;
      }
    }

  });
};

const filterData = function(data, filterState, user) {
  if (filterState === filterStates.BORED || (user && user.hasherId === data.id)) {
    return data;
  } else {
    const filteredFields = {
      hashName: data.hashName,
      deathDate: data.deathDate,
      id: data.id,
      obituaryMd: data.obituaryMd
    };
    if (filterState === filterStates.VERIFIED) {
      filteredFields.firstTrailDate = data.firstTrailDate;
      filteredFields.firstTrailNumber = data.firstTrailNumber;
      filteredFields.namingTrailDate = data.namingTrailDate;
      filteredFields.namingTrailNumber = data.namingTrailNumber;
      const potentialFields = {
        birthDay: 'birthDayPrivacy',
        birthMonth: 'birthMonthPrivacy',
        birthYear: 'birthYearPrivacy',
        familyName: 'familyNamePrivacy',
        givenName: 'givenNamePrivacy',
        headshotUrl: 'headshotPrivacy',
        motherHash: 'motherHashPrivacy',
        whoMadeYouCum: 'whoMadeYouCumPrivacy'
      };
      for (let [field, privacy] of Object.entries(potentialFields)) {
        if (data[privacy] === 'directory') {
          filteredFields[field] = data[field];
        }
      }
      ['addresses', 'emails', 'phones'].forEach(baseField => {
        filteredFields[baseField] = data[baseField] ? data[baseField].filter(value => {
          return value.privacy === 'directory' ? value : false;
        }) : [];
      });
    }
    return filteredFields;
  }
};

module.exports = {
  before: {
    all: [],
    find: [ attachAuthInfo, beforeFindHook ],
    get: [ attachAuthInfo ],
    create: [ jwtAuthentication, authHook.restrictTo(authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS), createAndUpdateFields ],
    update: [ jwtAuthentication, authHook.restrictToUserOrPositions({ idField: 'hasherId', ownerField: 'id' }, ...boredPositions), createAndUpdateFields, makeRaw ],
    patch: [ jwtAuthentication, authHook.restrictTo() ],
    remove: [ jwtAuthentication, authHook.restrictTo() ]
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
