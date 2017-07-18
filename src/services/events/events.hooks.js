const makeRaw = require('../../utils/make-raw');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [makeRaw],
    patch: [],
    remove: []
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
