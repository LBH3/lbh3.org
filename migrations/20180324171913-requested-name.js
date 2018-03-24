const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);

  return queryInterface.removeColumn('events', 'hashers_total').then(function() {
    return queryInterface.removeColumn('hashers', 'hare_count_1');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'hare_count_2');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'miles');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'run_mileage');
  }, errorHandler).then(function() {
    return queryInterface.addColumn('users', 'requested_name', tableColumns.users.requestedName);
  }, errorHandler);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.removeColumn('users', 'requested_name').then(null, errorHandler);
};
