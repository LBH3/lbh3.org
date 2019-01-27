const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');
const crypto = require('crypto');
const errors = require('@feathersjs/errors');

const afterHook = function(hook) {
  const ballots = hook.result.data;

  // Fetch the paper ballots taken during this election
  const paperBallotService = hook.app.service('api/paper-ballots');
  return paperBallotService.find({
    query: {
      electionId: hook.params.query.electionId
    },
    user: hook.params.user
  }).then(results => {
    const paperBallots = results.data;

    // Get the hasher IDs of everyone who took a paper ballot
    const hasherIdsWhoTookPaperBallots = paperBallots.map(paperBallot => {
      return paperBallot.hasherId;
    });

    // Generate a key for the hasherIdHmac; this needs to be the same for every ballot
    const key = Math.random().toString();

    // Run through all the ballots
    ballots.forEach(ballot => {

      // Mark ballots that should be removed because the hasher took a paper ballot too
      ballot.hasherTookPaperBallot = hasherIdsWhoTookPaperBallots.indexOf(ballot.hasherId) > -1;

      // Add hasherIdHmac and remove hasherId
      const hash = crypto.createHmac('sha256', key);
      hash.update(ballot.hasherId.toString());
      ballot.hasherIdHmac = hash.digest('base64');

      if (hook.params.user.canManageUsers !== true) {
        delete ballot.hasherId;
      }
    });
  });
};

const beforeFindHook = function(hook) {

  // Allow users to fetch their own paper ballots
  if (hook.params.query.hasherId) {
    if (Number(hook.params.query.hasherId) === hook.params.user.hasherId) {
      return hook;
    }
    // If it’s not the user querying for their own ballot, restrict to webmaster
    return authHook.restrictToWebmaster(hook);
  }

  // If there’s no query by hasherId, then continue
  return hook;
};

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
    find: [ authHook.restrictToSignedInHashers, beforeFindHook ],
    get: [ authHook.restrictTo() ],
    create: [ authHook.restrictToSignedInHashers, createHook ],
    update: [ authHook.restrictTo() ],
    patch: [ authHook.restrictTo() ],
    remove: [ authHook.restrictTo() ]
  },

  after: {
    all: [],
    find: [ afterHook ],
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
