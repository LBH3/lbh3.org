const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  return queryInterface.createTable('paper_ballots', tableColumns.paper_ballots);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.dropTable('paper_ballots');
};
