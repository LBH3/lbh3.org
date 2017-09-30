// Initializes the `bored-positions` service on path `/api/bored-positions`
const createService = require('feathers-sequelize');
const createModel = require('../../models/bored-positions.model');
const hooks = require('./bored-positions.hooks');
const filters = require('./bored-positions.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'bored-positions',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/bored-positions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/bored-positions');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
