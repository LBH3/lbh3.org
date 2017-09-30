// Initializes the `bored-hashers` service on path `/api/bored-hashers`
const createService = require('feathers-sequelize');
const createModel = require('../../models/bored-hashers.model');
const hooks = require('./bored-hashers.hooks');
const filters = require('./bored-hashers.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'bored-hashers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/bored-hashers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/bored-hashers');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
