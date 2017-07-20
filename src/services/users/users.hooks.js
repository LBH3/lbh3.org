const { authenticate } = require('feathers-authentication').hooks;
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');


const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
    ownerField: 'id'
  })
];

const userInfo = function(hook) {
  if (hook.data && hook.data.google) {
    const googleProfile = hook.data.google.profile;
    const profileData = {};
    for (var key in googleProfile) {
      if (googleProfile.hasOwnProperty(key) && key[0] !== '_') {
        profileData[key] = googleProfile[key];
      }
    }
    hook.data.googleProfile = profileData;
  }
};

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ ...restrict ],
    create: [ userInfo ],
    update: [ ...restrict, userInfo ],
    patch: [ ...restrict ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      commonHooks.when(
        hook => hook.params.provider,
        commonHooks.discard('password')
      )
    ],
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
