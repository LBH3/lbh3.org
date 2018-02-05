// Initializes the `patches` service on path `/api/patches`
const createService = require('feathers-sequelize');
const createModel = require('../../models/patches.model');
const hooks = require('./patches.hooks');
const filters = require('./patches.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'patches',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/patches', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/patches');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
