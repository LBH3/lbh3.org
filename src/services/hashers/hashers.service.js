// Initializes the `hashers` service on path `/api/hashers`
const createService = require('feathers-sequelize');
const createModel = require('../../models/hashers.model');
const hooks = require('./hashers.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'hashers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/hashers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/hashers');

  service.hooks(hooks);
};
