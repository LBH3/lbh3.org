const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  return queryInterface.addColumn('events', 'special_event_id', tableColumns.events.specialEventId);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.removeColumn('events', 'special_event_id').then(null, errorHandler);
};
