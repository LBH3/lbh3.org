const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

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

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'assets', 'favicon.ico')));

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

// Raygun
const raygun = require('raygun');
const raygunClient = new raygun.Client().init({ apiKey: app.get('raygun').apiKey });
app.use(raygunClient.expressHandler);

app.hooks(appHooks);

module.exports = app;
