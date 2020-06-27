const tables = require("../config/tables");

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  return queryInterface.createTable(
    "events_routes",
    tableColumns.events_routes
  );
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.dropTable("events_routes");
};
