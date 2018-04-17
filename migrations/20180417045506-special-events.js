const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  return queryInterface.createTable('special_events', tableColumns.special_events);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.dropTable('special_events');
};
