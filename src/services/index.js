const users = require('./users/users.service.js');
const events = require('./events/events.service.js');
const eventYears = require('./event-years/event-years.service.js');
const places = require('./places/places.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(events);
  app.configure(eventYears);
  app.configure(places);
};
