/*eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');
const errors = require('feathers-errors');
const getBoredHasher = require('../../utils/get-bored-hasher');
const jwtAuthentication = authenticate('jwt');
const makeRaw = require('../../utils/make-raw');
const searchHook = require('../../hooks/search');

const afterFindHook = function(hook) {
  if (hook) {
    return hook;
  }
  const hashers = hook.result.data || [];
  const sequelizeClient = hook.app.get('sequelizeClient');
  const promises = hashers.map(hasher => {
    return getRunMileageForHasher(sequelizeClient, hasher.id);
  });
  return Promise.all(promises).then(results => {
    results.forEach((result, index) => {
      hashers[index].runMileage = Number(result);
    });
    return hook;
  });
};

const afterGetHook = function(hook) {
  const user = hook.params.user;
  if (user) {
    const hasherId = hook.result.id;
    if (hasherId === user.hasherId) {
      // Ok to not filter the data and include the hasher’s mileage
      return new Promise(function(resolve) {
        const sequelizeClient = hook.app.get('sequelizeClient');
        getRunMileageForHasher(sequelizeClient, hasherId).then(runMileage => {
          hook.result.runMileage = Number(runMileage);
          resolve(hook);
        }, error => {
          console.error(`Failed to fetch run mileage for hasher #${hasherId} with error:`, error);
          resolve(hook);
        });
      });
    } else {
      return new Promise(function(resolve) {
        getBoredHasher(hook.app, user).then(boredHashers => {
          const found = boredHashers.data.find(boredHasher => {
            return boredPositions.includes(boredHasher.positionId);
          });
          if (found) {
            // Ok to not filter the data and include the hasher’s mileage
            const sequelizeClient = hook.app.get('sequelizeClient');
            getRunMileageForHasher(sequelizeClient, hasherId).then(runMileage => {
              hook.result.runMileage = Number(runMileage);
              resolve(hook);
            }, error => {
              console.error(`Failed to fetch run mileage for hasher #${hasherId} with error:`, error);
              resolve(hook);
            });
          } else {
            hook.result = filterData(hook.result);
          }
          resolve(hook);
        }, () => {
          hook.result = filterData(hook.result);
          resolve(hook);
        });
      });
    }
  } else {
    hook.result = filterData(hook.result);
  }
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
  authHook.HASH_CASH,
  authHook.HASH_HISTORIANS,
  authHook.ON_DISK,
  authHook.ON_SEC,
  authHook.TRAILMASTERS,
  authHook.WEBMASTERS
];

const createAndUpdateFields = function(hook) {
  const googleProfile = hook.params.user.googleProfile || {};
  let displayName = googleProfile.displayName || '';
  if (!displayName && googleProfile.emails && googleProfile.emails[0]) {
    displayName = googleProfile.emails[0];
  }

  if (hook.method === 'create' && !hook.data.createdBy && !hook.data.createdByUserId) {
    hook.data.createdBy = displayName;
    hook.data.createdByUserId = hook.params.user.id || 0;
  }

  hook.data.updatedBy = displayName;
  hook.data.updatedByUserId = hook.params.user.id || 0;

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
};

const getRunMileageForHasher = function(sequelize, hasherId) {
  const query = `SELECT SUM(events.miles) FROM events_hashers INNER JOIN events ON (events_hashers.trail_number = events.trail_number) WHERE hasher_id=${hasherId}`;
  return sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT
  }).then(result => {
    return result && result[0] && result[0].sum || 0;
  });
};

const filterData = function(data) {
  const allowedFields = ['hashName', 'id'];
  const filteredFields = {};
  allowedFields.forEach(field => {
    filteredFields[field] = data[field];
  });
  return filteredFields;
};

module.exports = {
  before: {
    all: [],
    find: [
      jwtAuthentication,
      authHook.restrictTo(...boredPositions),
      searchHook({
        contains: ['emailAddresses', 'emailAddressesPrivate'],
        fields: ['familyName', 'givenName', 'hashName']
      })
    ],
    get: [ attachAuthInfo ],
    create: [ jwtAuthentication, authHook.restrictTo(authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS), createAndUpdateFields ],
    update: [ jwtAuthentication, authHook.restrictTo(...boredPositions), createAndUpdateFields, makeRaw ],
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
