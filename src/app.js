const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const Honeybadger = require('honeybadger').configure({ apiKey: 'a6a30ced' });

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const rest = require('@feathersjs/express/rest');
const socketio = require('@feathersjs/socketio');

const handler = require('@feathersjs/express/errors');
const notFound = require('feathers-errors/not-found');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const authentication = require('./authentication');

const sequelize = require('./sequelize');

const app = express(feathers());

// Load app configuration
app.configure(configuration());

app.use(Honeybadger.requestHandler);

// Enable CORS, security, compression, favicon and body parsing
const limit = 1000000; // 1MB
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json({ limit }));
app.use(bodyParser.urlencoded({ extended: true, limit }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use('/', express.static(app.get('public')));

app.configure(sequelize);
app.configure(rest());
app.configure(socketio());

// Configure authentication
app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);

// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());

app.use(Honeybadger.errorHandler);

app.hooks(appHooks);

module.exports = app;
