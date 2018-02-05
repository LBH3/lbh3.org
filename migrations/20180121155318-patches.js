const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  return queryInterface.createTable('patches', tableColumns.patches);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.dropTable('patches');
};
