// Initializes the `ballots` service on path `/api/ballots`
const createService = require('feathers-sequelize');
const createModel = require('../../models/ballots.model');
const hooks = require('./ballots.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'ballots',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/ballots', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/ballots');

  service.hooks(hooks);
};
