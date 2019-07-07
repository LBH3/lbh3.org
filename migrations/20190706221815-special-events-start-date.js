const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  return queryInterface.addColumn('special_events', 'location_google_place_id', tableColumns.special_events.locationGooglePlaceId).then(function() {
    return queryInterface.addColumn('special_events', 'location_md', tableColumns.special_events.locationMd);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('special_events', 'photos_url', tableColumns.special_events.photosUrl);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('special_events', 'start_datetime', tableColumns.special_events.startDatetime);
  }, errorHandler);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.removeColumn('special_events', 'location_google_place_id').then(function() {
    return queryInterface.removeColumn('special_events', 'location_md');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('special_events', 'photos_url');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('special_events', 'start_datetime');
  }, errorHandler);
};
