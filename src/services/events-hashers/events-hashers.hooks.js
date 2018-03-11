const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');

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
    new Promise(function(resolve, reject) {
      if (hook.data.hasherId) {
        resolve(hook.data);
      } else {
        hook.service.get(hook.id).then(resolve, reject);
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
            eventHasher,
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
      const didHare = hook.data.role.substr(0, 4) === 'Hare';
      const eventMiles = Number(event.miles);

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
        hareCount1: (didHare) ? (hasher.hareCount1 + 1) : hasher.hareCount1,
        hareCount2: (didHare) ? (hasher.hareCount2 + 1) : hasher.hareCount2,
        lastTrailDate,
        miles: Number(hasher.miles) + eventMiles,
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
    getRequiredData(hook).then(({event, eventHasher, hasher}) => {
      getFirstAndLastTrailData({event, hasher, hook}).then(({newFirstTrail, newLastTrail}) => {
        const didHare = eventHasher.role.substr(0, 4) === 'Hare';
        const eventMiles = Number(event.miles);
        const hasherPatchData = {
          firstTrailDate: (newFirstTrail) ? newFirstTrail.start_datetime : null,
          firstTrailNumber: (newFirstTrail) ? newFirstTrail.trail_number : null,
          hareCount1: (didHare) ? (hasher.hareCount1 - 1) : hasher.hareCount1,
          hareCount2: (didHare) ? (hasher.hareCount2 - 1) : hasher.hareCount2,
          lastTrailDate: (newLastTrail) ? newLastTrail.start_datetime : null,
          miles: Number(hasher.miles) - eventMiles,
          runCount: Number(hasher.runCount) - 1
        };
        hook.app.service('api/hashers').patch(hasher.id, hasherPatchData).then(() => {
          resolve(hook);
        }, reject);
      }, reject);
    }, reject);
  });
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ authHook.restrictToSignedInHashers ],
    get: [ authHook.restrictToSignedInHashers ],
    create: [ authHook.restrictTo(authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS), createHook ],
    update: [ authHook.restrictTo() ],
    patch: [ authHook.restrictTo() ],
    remove: [ authHook.restrictTo(authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS), removeHook ]
  },

  after: {
    all: [],
    find: [],
    get: [],
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
