// Initializes the `event-years` service on path `/api/event-years`
const createService = require('./event-years.class.js');
const hooks = require('./event-years.hooks');
const filters = require('./event-years.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    app,
    name: 'event-years',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/event-years', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/event-years');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
