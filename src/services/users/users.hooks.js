const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');
const commonHooks = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const restrictToUser = restrictToOwner({
  idField: 'id',
  ownerField: 'id'
});

const restrictToWebmaster = authHook.restrictTo(authHook.WEBMASTERS);

const authHooksForUser = [
  authenticate('jwt'),
  restrictToUser
];

const authHookForWebmaster = function(hook) {
  return new Promise(function(resolve, reject) {
    const authForWebmaster = restrictToWebmaster(hook);
    if (authForWebmaster === hook) {
      resolve(hook);
    } else {
      authForWebmaster.then(resolve, reject);
    }
  });
};

const authHooksForUserOrWebmaster = [
  authenticate('jwt'),
  function(hook) {
    return new Promise(function(resolve, reject) {
      try {
        const authForUser = restrictToUser(hook);
        if (authForUser === hook) {
          authHookForWebmaster(hook).then(resolve, reject);
        } else {
          authForUser.then(resolve, error => { // eslint-disable-line no-unused-vars
            authHookForWebmaster(hook).then(resolve, reject);
          });
        }
      } catch (error) { // eslint-disable-line no-unused-vars
        authHookForWebmaster(hook).then(resolve, reject);
      }
    });
  }
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
    const oneMonthAgo = new Date((new Date()).setMonth((new Date()).getMonth() - 1));
    const boredHashersQuery = {
      query: {
        endDate: {
          $gte: oneMonthAgo
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
        canManageUsers: false,
        canViewDirectoryInfo: false,
        canViewHashersEmailList: false,
        canViewOldData: false,
        canViewRunAttendance: false
      };
      if (boredPositions.includes(authHook.HASH_CASH)) {
        permission = Object.assign(permission, {
          canEditHasherInfo: true,
          canViewDirectoryInfo: true,
          canViewRunAttendance: true
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
          canViewDirectoryInfo: true,
          canViewHashersEmailList: true,
          canViewOldData: true,
          canViewRunAttendance: true
        });
      }
      if (boredPositions.includes(authHook.ON_DISK)) {
        permission = Object.assign(permission, {
          canAddHashers: true,
          canEditHasherInfo: true,
          canEditPostTrailInfo: true,
          canViewDirectoryInfo: true,
          canViewHashersEmailList: true,
          canViewOldData: true,
          canViewRunAttendance: true
        });
      }
      if (boredPositions.includes(authHook.ON_SEC)) {
        permission = Object.assign(permission, {
          canAddSnoozes: true,
          canViewDirectoryInfo: true,
          canViewRunAttendance: true
        });
      }
      if (boredPositions.includes(authHook.TRAILMASTERS)) {
        permission = Object.assign(permission, {
          canEditPreTrailInfo: true,
          canViewDirectoryInfo: true
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
          canManageUsers: true,
          canViewDirectoryInfo: true,
          canViewHashersEmailList: true,
          canViewOldData: true,
          canViewRunAttendance: true
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
    get: [ ...authHooksForUserOrWebmaster ],
    create: [ userInfo ],
    update: [ ...authHooksForUserOrWebmaster, userInfo ],
    patch: [ ...authHooksForUser ],
    remove: [ ...authHooksForUser ]
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
