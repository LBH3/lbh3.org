/* eslint-disable no-console */
const { authenticate } = require('feathers-authentication').hooks;
const { Client } = require('pg');
const authHook = require('../../hooks/auth');

const getFirstOrLastTrailForHasher = function(first, hasherId) {
  const sortDirection = first ? 'ASC' : 'DESC';
  return new Promise(function(resolve, reject) {
    const client = new Client({
      database: 'lbh3'
    });
    client.connect();
    client.query(`SELECT events.* FROM events_hashers INNER JOIN events ON (events_hashers.trail_number = events.trail_number) WHERE hasher_id=${hasherId} ORDER BY events.start_datetime ${sortDirection} LIMIT 2`, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response && response.rows || []);
      }
      client.end();
    });
  });
};

const getFirstAndLastTrailData = function({event, hasher}) {
  return new Promise(function(resolve, reject) {
    getFirstOrLastTrailForHasher(true, hasher.id).then(firstTrails => {
      let newFirstTrail;
      if (firstTrails.length) {
        newFirstTrail = (firstTrails[0].start_datetime.getTime() === event.startDatetime.getTime()) ? firstTrails[1] : firstTrails[0];
      }
      getFirstOrLastTrailForHasher(false, hasher.id).then(lastTrails => {
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
  console.info('getRequiredData()');
  return new Promise(function(resolve, reject) {
    new Promise(function(resolve, reject) {
      console.info(`hook.data.hasherId: ${hook.data.hasherId}`);
      if (hook.data.hasherId) {
        resolve(hook.data);
      } else {
        hook.service.get(hook.id).then(resolve, reject);
      }
    }).then(eventHasher => {
      console.info(`eventHasher.trailNumber: ${eventHasher.trailNumber}`);
      hook.app.service('api/events').find({query: {trailNumber: eventHasher.trailNumber}}).then(events => {
        console.info(`eventHasher.hasherId: ${eventHasher.hasherId}`);
        hook.app.service('api/hashers').get(eventHasher.hasherId, hook.params).then(hasher => {
          console.info('Did get hasher');
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
        runCount: Number(hasher.runCount) + 1,
        runMileage: Number(hasher.runMileage) + eventMiles
      };
      hook.app.service('api/hashers').patch(hasher.id, hasherPatchData).then(() => {
        const eventPatchData = {
          hashersTotal: Number(event.hashersTotal) + 1
        };
        hook.app.service('api/events').patch(event.id, eventPatchData).then(() => {
          resolve(hook);
        }, reject);
      }, reject);
    }, reject);
  });
};

const removeHook = function(hook) {
  console.info('Inside events-hashers before hook');
  return new Promise(function(resolve, reject) {
    getRequiredData(hook).then(({event, eventHasher, hasher}) => {
      console.info('Did getRequiredData()');
      getFirstAndLastTrailData({event, hasher}).then(({newFirstTrail, newLastTrail}) => {
        const didHare = eventHasher.role.substr(0, 4) === 'Hare';
        console.info(`didHare: ${didHare}`);
        const eventMiles = Number(event.miles);
        console.info(`eventMiles: ${eventMiles}`);
        const hasherPatchData = {
          firstTrailDate: (newFirstTrail) ? newFirstTrail.start_datetime : null,
          firstTrailNumber: (newFirstTrail) ? newFirstTrail.trail_number : null,
          hareCount1: (didHare) ? (hasher.hareCount1 - 1) : hasher.hareCount1,
          hareCount2: (didHare) ? (hasher.hareCount2 - 1) : hasher.hareCount2,
          lastTrailDate: (newLastTrail) ? newLastTrail.start_datetime : null,
          miles: Number(hasher.miles) - eventMiles,
          runCount: Number(hasher.runCount) - 1,
          runMileage: Number(hasher.runMileage) - eventMiles
        };
        console.info('Making api/hashers patch call with data:', hasherPatchData);
        hook.app.service('api/hashers').patch(hasher.id, hasherPatchData).then(() => {
          const eventPatchData = {
            hashersTotal: Number(event.hashersTotal) - 1
          };
          console.info('Making api/events patch call with data:', eventPatchData);
          hook.app.service('api/events').patch(event.id, eventPatchData).then(() => {
            resolve(hook);
          }, reject);
        }, reject);
      }, reject);
    }, reject);
  });
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ authHook.restrictTo(authHook.GRANDMASTERS, authHook.HASH_CASH, authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.ON_SEC, authHook.WEBMASTERS) ],
    get: [ authHook.restrictTo(authHook.GRANDMASTERS, authHook.HASH_CASH, authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.ON_SEC, authHook.WEBMASTERS) ],
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
