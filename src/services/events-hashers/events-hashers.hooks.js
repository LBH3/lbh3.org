const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');

const restrictToBored = [
  authenticate('jwt'),
  authHook.restrictToBored()
];

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ ...restrictToBored ],
    update: [ ...restrictToBored ],
    patch: [ ...restrictToBored ],
    remove: [ ...restrictToBored ]
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
