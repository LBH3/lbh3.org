// Initializes the `places` service on path `/api/places`
const createService = require('feathers-sequelize');
const createModel = require('../../models/places.model');
const hooks = require('./places.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'places',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/places', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/places');

  service.hooks(hooks);
};
