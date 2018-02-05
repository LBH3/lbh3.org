const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');
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

const getBoredInfo = function(hook) {
  return new Promise(function(resolve, reject) {
    const now = new Date();
    const boredHashersQuery = {
      query: {
        endDate: {
          $gte: now
        },
        hasherId: hook.result.hasherId,
        startDate: {
          $lte: now
        }
      }
    };
    hook.app.service('api/bored-hashers').find(boredHashersQuery).then(boredHashers => {
      const boredPositions = boredHashers.data.map(boredHasher => {
        return boredHasher.positionId;
      });
      let permission = {
        canAddHashers: false,
        canAddPhotos: false,
        canAddSnoozes: false,
        canAddTrails: false,
        canEditHasherInfo: false,
        canEditPostTrailInfo: false,
        canEditPreTrailInfo: false,
        canViewHashersEmailList: false,
        canViewHashersList: false,
        canViewOldData: false
      };
      if (boredPositions.includes(authHook.HASH_CASH)) {
        permission = Object.assign(permission, {
          canEditHasherInfo: true,
          canViewHashersList: true
        });
      }
      if (boredPositions.includes(authHook.HASH_FLASH)) {
        permission = Object.assign(permission, {
          canAddPhotos: true
        });
      }
      if (boredPositions.includes(authHook.HASH_HISTORIANS)) {
        permission = Object.assign(permission, {
          canAddHashers: true,
          canAddPhotos: true,
          canAddSnoozes: true,
          canEditHasherInfo: true,
          canEditPostTrailInfo: true,
          canViewHashersEmailList: true,
          canViewHashersList: true,
          canViewOldData: true
        });
      }
      if (boredPositions.includes(authHook.ON_DISK)) {
        permission = Object.assign(permission, {
          canAddHashers: true,
          canEditHasherInfo: true,
          canEditPostTrailInfo: true,
          canViewHashersEmailList: true,
          canViewHashersList: true,
          canViewOldData: true
        });
      }
      if (boredPositions.includes(authHook.ON_SEC)) {
        permission = Object.assign(permission, {
          canAddSnoozes: true,
          canViewHashersList: true
        });
      }
      if (boredPositions.includes(authHook.TRAILMASTERS)) {
        permission = Object.assign(permission, {
          canEditPreTrailInfo: true,
          canViewHashersList: true
        });
      }
      if (boredPositions.includes(authHook.WEBMASTERS)) {
        permission = Object.assign(permission, {
          canAddHashers: true,
          canAddPhotos: true,
          canAddSnoozes: true,
          canAddTrails: true,
          canEditHasherInfo: true,
          canEditPostTrailInfo: true,
          canEditPreTrailInfo: true,
          canViewHashersEmailList: true,
          canViewHashersList: true,
          canViewOldData: true
        });
      }
      hook.result = Object.assign(hook.result, permission);
      resolve(hook);
    }, reject);
  });
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
    get: [ getBoredInfo ],
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
