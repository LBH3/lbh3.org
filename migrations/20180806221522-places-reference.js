const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  return queryInterface.changeColumn('google_places', 'reference', tableColumns.google_places.reference);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.changeColumn('google_places', 'reference', {
    type: Sequelize.STRING,
    notNull: true,
    field,
    defaultValue: ''
  }).then(null, errorHandler);
};
