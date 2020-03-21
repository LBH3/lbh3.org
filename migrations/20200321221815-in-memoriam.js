const childProcess = require('child_process');
const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  return queryInterface.addColumn('hashers', 'death_date', tableColumns.hashers.deathDate).then(function() {
    return queryInterface.addColumn('hashers', 'obituary_md', tableColumns.hashers.obituaryMd);
  }, errorHandler);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.removeColumn('hashers', 'death_date').then(function() {
    return queryInterface.removeColumn('hashers', 'obituary_md');
  }, errorHandler);
};
