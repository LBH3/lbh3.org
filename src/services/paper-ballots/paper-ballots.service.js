// Initializes the `paper-ballots` service on path `/api/paper-ballots`
const createService = require('feathers-sequelize');
const createModel = require('../../models/paper-ballots.model');
const hooks = require('./paper-ballots.hooks');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'paper-ballots',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/paper-ballots', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/paper-ballots');

  service.hooks(hooks);
};
