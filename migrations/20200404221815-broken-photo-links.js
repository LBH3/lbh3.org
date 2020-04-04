const childProcess = require('child_process');
const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  return queryInterface.addColumn('events', 'photos_url_checked_datetime', tableColumns.events.photosUrlCheckedDatetime).then(function() {
    return queryInterface.addColumn('events', 'photos_url_checked_status', tableColumns.events.photosUrlCheckedStatus);
  }, errorHandler);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.removeColumn('events', 'photos_url_checked_datetime').then(function() {
    return queryInterface.removeColumn('events', 'photos_url_checked_status');
  }, errorHandler);
};
