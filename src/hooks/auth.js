const errors = require('@feathersjs/errors');
const getBoredHasher = require('../utils/get-bored-hasher');
const { restrictToOwner } = require('feathers-authentication-hooks');

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

const positions = {
  GRANDMASTERS: 2,
  HASH_CASH: 4,
  HASH_FLASH: 5,
  HASH_HISTORIANS: 6,
  ON_DISK: 14,
  ON_SEC: 15,
  TRAILMASTERS: 19,
  WEBMASTERS: 20
};

const restrictTo = function(...boredPositions) {
  return function(hook) {
    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }

    const user = hook.params.user;
    if (!user) {
      throw new errors.NotAuthenticated('You are not authenticated.');
    }

    const error = new errors.Forbidden('You do not have valid permissions to access this.');

    return new Promise(function(resolve, reject) {
      getBoredHasher(hook.app, user).then(boredHashers => {
        const found = boredHashers.data.find(boredHasher => {
          return boredPositions.includes(boredHasher.positionId);
        });
        if (found) {
          resolve(hook);
        } else {
          reject(error);
        }
      }, reject);
    });
  };
};

const restrictToSignedInHashers = function(hook) {

  // If it was an internal call then skip this hook
  if (!hook.params.provider) {
    return hook;
  }

  const user = hook.params.user;
  if (!user || !user.hasherId) {
    throw new errors.NotAuthenticated('You are not authenticated.');
  }
};

const restrictToUser = restrictToOwner({
  idField: 'id',
  ownerField: 'id'
});

const restrictToUserOrPositions = function(...boredPositions) {
  return function(hook) {
    return new Promise(function(resolve, reject) {
      const restrictToPositions = restrictTo(...boredPositions);
      try {
        const authForUser = restrictToOwner({
          idField: 'hasherId',
          ownerField: 'id'
        })(hook);
        if (authForUser === hook) {
          restrictToPositions(hook).then(resolve, reject);
        } else {
          authForUser.then(resolve, error => { // eslint-disable-line no-unused-vars
            restrictToPositions(hook).then(resolve, reject);
          });
        }
      } catch (error) { // eslint-disable-line no-unused-vars
        restrictToPositions(hook).then(resolve, reject);
      }
    });
  };
};

const restrictToUserOrWebmaster = function(hook) {
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
};

const restrictToWebmaster = restrictTo(positions.WEBMASTERS);

module.exports = {
  ...positions,
  restrictTo,
  restrictToSignedInHashers,
  restrictToUser,
  restrictToUserOrPositions,
  restrictToUserOrWebmaster,
  restrictToWebmaster
};
