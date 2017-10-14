// Initializes the `events-hashers` service on path `/api/events-hashers`
const createService = require('feathers-sequelize');
const createModel = require('../../models/events-hashers.model');
const hooks = require('./events-hashers.hooks');
const filters = require('./events-hashers.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'events-hashers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/events-hashers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/events-hashers');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
