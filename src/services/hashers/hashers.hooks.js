const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');
const searchHook = require('../../hooks/search');

const restrictToAdmin = [
  authenticate('jwt'),
  authHook.restrictToAdmin()
];

module.exports = {
  before: {
    all: [],
    find: [
      searchHook({
        fields: ['familyName', 'givenName', 'hashName']
      })
    ],
    get: [],
    create: [ ...restrictToAdmin ],
    update: [ ...restrictToAdmin ],
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
