const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);

  return queryInterface.createTable('elections', tableColumns.elections).then(function() {
    return queryInterface.createTable('ballots', tableColumns.ballots);
  }, errorHandler);
};

exports.down = function (queryInterface) {
  return queryInterface.dropTable('ballots').then(function() {
    return queryInterface.dropTable('elections');
  }, errorHandler);
};
