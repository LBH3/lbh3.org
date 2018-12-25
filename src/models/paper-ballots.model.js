// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');
const tables = require('../../config/tables');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  const specialEvents = sequelizeClient.define('paper_ballots', tableColumns.paper_ballots, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    },
    tableName: 'paper_ballots',
    underscored: true
  });

  specialEvents.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return specialEvents;
};
