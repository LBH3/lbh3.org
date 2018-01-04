const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

const newEventColumnNames = {
  addedWriteupMd: 'added_writeup_md',
  additionalWriteupMd: 'additional_writeup_md',
  harePatchesMd: 'hare_patches_md',
  hashersTotal: 'hashers_total',
  miles: 'miles',
  newBootsMd: 'new_boots_md',
  newNamesMd: 'new_names_md',
  patchesMd: 'patches_md',
  returnersMd: 'returners_md',
  snoozeDatePrimary: 'snooze_date_primary',
  snoozeDateSecondary: 'snooze_date_secondary',
  visitorsMd: 'visitors_md'
};

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);

  return queryInterface.createTable('bored_hashers', tableColumns.bored_hashers).then(function() {
    return queryInterface.createTable('bored_positions', tableColumns.bored_positions);
  }, errorHandler).then(function() {
    return queryInterface.createTable('bored_years', tableColumns.bored_years);
  }, errorHandler).then(function() {
    return queryInterface.createTable('events_hashers', tableColumns.events_hashers);
  }, errorHandler).then(function() {
    return queryInterface.dropTable('hashers');
  }, errorHandler).then(function() {
    return queryInterface.createTable('hashers', tableColumns.hashers);
  }, errorHandler).then(function() {
    const promises = [];
    for (let columnProperty in newEventColumnNames) {
      promises.push(queryInterface.addColumn('events', newEventColumnNames[columnProperty], tableColumns.events[columnProperty]));
    }
    return Promise.all(promises);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('users', 'hasher_id', tableColumns.users.hasherId);
  }, errorHandler);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.dropTable('bored_hashers').then(function() {
    return queryInterface.dropTable('bored_years');
  }, errorHandler).then(function() {
    return queryInterface.dropTable('events_hashers');
  }, errorHandler).then(function() {
    return queryInterface.dropTable('hashers');
  }, errorHandler).then(function() {
    const promises = [];
    for (let columnProperty in newEventColumnNames) {
      promises.push(queryInterface.removeColumn('events', newEventColumnNames[columnProperty]));
    }
    return Promise.all(promises);
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('users', 'hasher_id');
  }, errorHandler);
};
