/*eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');
const errors = require('@feathersjs/errors');
const getBoredHasher = require('../../utils/get-bored-hasher');
const jwtAuthentication = authenticate('jwt');
const makeRaw = require('../../utils/make-raw');
const searchHook = require('../../hooks/search');

const shouldFilterData = function(hook) {
  return new Promise(function(resolve) {
    const user = hook.params.user;
    if (user) {
      const hasherId = hook.result ? hook.result.id : null;
      if (hasherId === user.hasherId) {
        // Ok to not filter the data and include the hasher’s mileage
        resolve(false);
      } else {
        getBoredHasher(hook.app, user).then(boredHashers => {
          const found = boredHashers.data.find(boredHasher => {
            return boredPositions.includes(boredHasher.positionId);
          });
          resolve(!found);
        }, () => {
          resolve(true);
        });
      }
    } else {
      resolve(true);
    }
  });
};

const beforeFindHook = function(hook) {
  return shouldFilterData(hook).then(filter => {
    if (filter) {
      return searchHook({
        fields: ['hash_name'],
        oldOptions: {
          fields: ['hashName']
        }
      })(hook);
    } else {
      return searchHook({
        contains: ['email_addresses', 'email_addresses_private'],
        fields: ['family_name', 'given_name', 'hash_name'],
        oldOptions: {
          contains: ['emailAddresses', 'emailAddressesPrivate'],
          fields: ['familyName', 'givenName', 'hashName']
        }
      })(hook);
    }
  });
};

const afterFindHook = function(hook) {
  return shouldFilterData(hook).then(filter => {
    const hashers = hook.result.data;
    if (filter) {
      hook.result.data = hashers.map(hasher => {
        return filterData(hasher);
      });
    }
    const sequelizeClient = hook.app.get('sequelizeClient');

    const promises = hashers.map(hasher => {
      const query = `
        (SELECT COUNT(id) FROM events_hashers WHERE hasher_id=${hasher.id} AND role ILIKE 'hare%')
        UNION ALL
        (SELECT COUNT(id) FROM events_hashers WHERE hasher_id=${hasher.id})
        UNION ALL
        (SELECT SUM(events.miles) FROM events_hashers INNER JOIN events ON (events_hashers.trail_number = events.trail_number) WHERE hasher_id=${hasher.id})
      `;
      return sequelizeClient.query(query, {
        type: sequelizeClient.QueryTypes.SELECT
      }).then(result => {
        if (result && result[0]) {
          hasher.hareCount = parseFloat(result[0].count) || 0;
          hasher.runCount = parseFloat(result[1].count) || 0;
          hasher.runMileage = parseFloat(result[2].count) || 0;
        }
      });
    });
    return Promise.all(promises).then(() => {
      return hook;
    });
  });
};

const updateHookResultWithHasherStats = function(hook) {
  return new Promise(function(resolve) {
    const hasherId = hook.result.id;
    const sequelizeClient = hook.app.get('sequelizeClient');

    getHareCountForHasher(sequelizeClient, hasherId).then(hareCount => {
      hook.result.hareCount = hareCount;

      getRunCountForHasher(sequelizeClient, hasherId).then(runCount => {
        hook.result.runCount = runCount;

        getRunMileageForHasher(sequelizeClient, hasherId).then(runMileage => {
          hook.result.runMileage = runMileage;
          resolve(hook);

        }, error => {
          console.error(`Failed to fetch run mileage for hasher #${hasherId} with error:`, error);
          resolve(hook);
        });

      }, error => {
        console.error(`Failed to fetch run count for hasher #${hasherId} with error:`, error);
        resolve(hook);
      });

    }, error => {
      console.error(`Failed to fetch hare count for hasher #${hasherId} with error:`, error);
      resolve(hook);
    });
  });
};

const afterGetHook = function(hook) {
  return shouldFilterData(hook).then(filter => {
    if (filter) {
      hook.result = filterData(hook.result);
    } else {
      return updateHookResultWithHasherStats(hook);
    }
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
  authHook.HASH_CASH,
  authHook.HASH_HISTORIANS,
  authHook.ON_DISK,
  authHook.ON_SEC,
  authHook.TRAILMASTERS,
  authHook.WEBMASTERS
];

const createAndUpdateFields = function(hook) {
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

const getHareCountForHasher = function(sequelize, hasherId) {
  const query = `SELECT COUNT(id) FROM events_hashers WHERE hasher_id=${hasherId} AND role ILIKE 'hare%'`;
  return sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT
  }).then(result => {
    const hareCountString = result && result[0] && result[0].count;
    return hareCountString && parseInt(hareCountString, 10) || 0;
  });
};

const getRunCountForHasher = function(sequelize, hasherId) {
  const query = `SELECT COUNT(id) FROM events_hashers WHERE hasher_id=${hasherId}`;
  return sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT
  }).then(result => {
    const runCountString = result && result[0] && result[0].count;
    return runCountString && parseInt(runCountString, 10) || 0;
  });
};

const getRunMileageForHasher = function(sequelize, hasherId) {
  const query = `SELECT SUM(events.miles) FROM events_hashers INNER JOIN events ON (events_hashers.trail_number = events.trail_number) WHERE hasher_id=${hasherId}`;
  return sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT
  }).then(result => {
    const runMileageString = result && result[0] && result[0].sum;
    return runMileageString && parseFloat(runMileageString) || 0;
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
      attachAuthInfo,
      beforeFindHook
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
