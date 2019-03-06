const indexes = require('../config/indexes');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  return queryInterface.addIndex('events_hashers', indexes.events_hashers_hasher_id_role);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.removeIndex('events_hashers', 'events_hashers_hasher_id_role');
};
