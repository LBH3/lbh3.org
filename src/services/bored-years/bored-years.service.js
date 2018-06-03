// Initializes the `bored-years` service on path `/api/bored-years`
const createService = require('feathers-sequelize');
const createModel = require('../../models/bored-years.model');
const hooks = require('./bored-years.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'bored-years',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/bored-years', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/bored-years');

  service.hooks(hooks);
};
