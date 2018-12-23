const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');
const commonHooks = require('feathers-hooks-common');

const userInfo = function(hook) {
  if (hook.data) {
    var key;
    if (hook.data.facebook && hook.data.facebook.profile) {
      const facebookProfile = hook.data.facebook.profile;
      const profileData = {};
      for (key in facebookProfile) {
        if (facebookProfile.hasOwnProperty(key) && key[0] !== '_') {
          profileData[key] = facebookProfile[key];
        }
      }
      hook.data.facebookProfile = profileData;
    } else if (hook.data.google) {
      const googleProfile = hook.data.google.profile;
      const profileData = {};
      for (key in googleProfile) {
        if (googleProfile.hasOwnProperty(key) && key[0] !== '_') {
          profileData[key] = googleProfile[key];
        }
      }
      hook.data.googleProfile = profileData;
    }
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
        canEditFutureSpecialEvents: false,
        canEditHasherInfo: false,
        canEditPostTrailInfo: false,
        canEditPreTrailInfo: false,
        canExportData: false,
        canManageUsers: false,
        canViewDirectoryInfo: false,
        canViewHashersEmailList: false,
        canViewOldData: false,
        canViewRunAttendance: false
      };
      if (boredPositions.includes(authHook.GRANDMASTERS)) {
        permission = Object.assign(permission, {
          canEditFutureSpecialEvents: true
        });
      }
      if (boredPositions.includes(authHook.HASH_CASH)) {
        permission = Object.assign(permission, {
          canEditHasherInfo: true,
          canExportData: true,
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
          canExportData: true,
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
          canExportData: true,
          canViewDirectoryInfo: true,
          canViewRunAttendance: true
        });
      }
      if (boredPositions.includes(authHook.WEBMASTERS)) {
        permission = Object.assign(permission, {
          canAddHashers: true,
          canAddPhotos: true,
          canAddSnoozes: true,
          canAddTrails: true,
          canEditFutureSpecialEvents: true,
          canEditHasherInfo: true,
          canEditPostTrailInfo: true,
          canEditPreTrailInfo: true,
          canExportData: true,
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
    get: [ authenticate('jwt'), authHook.restrictToUserOrWebmaster ],
    create: [ userInfo ],
    update: [ authenticate('jwt'), authHook.restrictToUserOrWebmaster, userInfo ],
    patch: [ authenticate('jwt'), authHook.restrictToUser ],
    remove: [ authenticate('jwt'), authHook.restrictToUser ]
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
