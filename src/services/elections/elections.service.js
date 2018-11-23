// Initializes the `elections` service on path `/api/elections`
const createService = require('feathers-sequelize');
const createModel = require('../../models/elections.model');
const hooks = require('./elections.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'elections',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/elections', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/elections');

  service.hooks(hooks);
};
