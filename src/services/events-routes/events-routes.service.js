// Initializes the `events-routes` service on path `/api/events-routes`
const createService = require('feathers-sequelize');
const createModel = require('../../models/events-routes.model');
const hooks = require('./events-routes.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'events-routes',
    Model,
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/api/events-routes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/events-routes');

  service.hooks(hooks);
};
