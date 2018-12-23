const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');
const crypto = require('crypto');
const errors = require('@feathersjs/errors');

const createHook = function(hook) {
  return new Promise((resolve, reject) => {
    const electionEligibilityService = hook.app.service('api/election-eligibility');
    const hasherId = hook.params.user.hasherId;

    electionEligibilityService.find({
      query: {
        electionId: hook.data.electionId,
        hasherId
      },
      user: hook.params.user
    }).then(results => {
      if (results.length === 1 && results[0].eligible === true) {
        const hash = crypto.createHash('sha256');
        hash.update(hook.data.encryptedBallot);
        hook.data.hasherId = hasherId;
        hook.data.sha256 = hash.digest('base64');
        resolve(hook);
      } else {
        reject(new errors.Forbidden('You are not eligible to vote.'));
      }
    }, reject);
  });
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ authHook.restrictToSignedInHashers ],
    get: [ authHook.restrictToSignedInHashers ],
    create: [ authHook.restrictToSignedInHashers, createHook ],
    update: [ authHook.restrictTo() ],
    patch: [ authHook.restrictTo() ],
    remove: [ authHook.restrictTo() ]
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
