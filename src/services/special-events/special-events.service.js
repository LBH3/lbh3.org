// Initializes the `special-events` service on path `/api/special-events`
const createService = require('feathers-sequelize');
const createModel = require('../../models/special-events.model');
const hooks = require('./special-events.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'special-events',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/special-events', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/special-events');

  service.hooks(hooks);
};
