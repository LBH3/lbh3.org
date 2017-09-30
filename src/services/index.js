const users = require('./users/users.service.js');
const events = require('./events/events.service.js');
const eventYears = require('./event-years/event-years.service.js');
const places = require('./places/places.service.js');
const boredYears = require('./bored-years/bored-years.service.js');
const boredPositions = require('./bored-positions/bored-positions.service.js');
const boredHashers = require('./bored-hashers/bored-hashers.service.js');
const hashers = require('./hashers/hashers.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(events);
  app.configure(eventYears);
  app.configure(places);
  app.configure(boredYears);
  app.configure(boredPositions);
  app.configure(boredHashers);
  app.configure(hashers);
};
