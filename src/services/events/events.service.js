// Initializes the `events` service on path `/api/events`
const createService = require('feathers-sequelize');
const createModel = require('../../models/events.model');
const hooks = require('./events.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'events',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/events', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/events');

  service.hooks(hooks);
};
