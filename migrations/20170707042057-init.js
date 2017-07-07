const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);

  return queryInterface.createTable('events', tableColumns.events).then(function() {
    return queryInterface.createTable('google_places', tableColumns.google_places);
  }, errorHandler).then(function() {
    return queryInterface.createTable('google_places_address_components', tableColumns.google_places_address_components);
  }, errorHandler).then(function() {
    return queryInterface.createTable('hashers', tableColumns.hashers);
  }, errorHandler).then(function() {
    return queryInterface.createTable('users', tableColumns.users);
  }, errorHandler);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.dropTable('events').then(function() {
    return queryInterface.dropTable('hashers');
  }, errorHandler).then(function() {
    return queryInterface.dropTable('google_places');
  }, errorHandler).then(function() {
    return queryInterface.dropTable('google_places_address_components');
  }, errorHandler);
};
