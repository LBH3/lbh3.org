const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');
const searchHook = require('../../hooks/search');

const restrictToAdmin = [
  authenticate('jwt'),
  authHook.restrictToAdmin()
];

const createAndUpdateFields = function(hook) {
  const googleProfile = hook.params.user.googleProfile || {};
  let displayName = googleProfile.displayName || '';
  if (!displayName && googleProfile.emails && googleProfile.emails[0]) {
    displayName = googleProfile.emails[0];
  }

  if (!hook.data.createdBy && !hook.data.createdByUserId) {
    hook.data.createdBy = displayName;
    hook.data.createdByUserId = hook.params.user.id || 0;
  }

  hook.data.updatedBy = displayName;
  hook.data.updatedByUserId = hook.params.user.id || 0;
};

module.exports = {
  before: {
    all: [],
    find: [
      searchHook({
        fields: ['familyName', 'givenName', 'hashName']
      })
    ],
    get: [],
    create: [ ...restrictToAdmin, createAndUpdateFields ],
    update: [ ...restrictToAdmin, createAndUpdateFields ],
    patch: [ ...restrictToAdmin ],
    remove: [ ...restrictToAdmin ]
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
