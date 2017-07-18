const Sequelize = require('sequelize');
const tables = require('../../config/tables');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  const places = sequelizeClient.define('places', tableColumns.google_places, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },
    tableName: 'google_places',
    underscored: true
  });

  places.associate = function (models) { // eslint-disable-line no-unused-vars
  };

  return places;
};
