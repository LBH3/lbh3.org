const childProcess = require('child_process');
const tables = require('../config/tables');

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const tableColumns = tables.getDefinitionsWithSequelize(Sequelize);
  return queryInterface.addColumn('hashers', 'addresses', tableColumns.hashers.addresses).then(function() {
    return queryInterface.addColumn('hashers', 'birth_day_privacy', tableColumns.hashers.birthDayPrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'birth_month_privacy', tableColumns.hashers.birthMonthPrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'birth_year_privacy', tableColumns.hashers.birthYearPrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'died_privacy', tableColumns.hashers.diedPrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'emails', tableColumns.hashers.emails);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'family_name_privacy', tableColumns.hashers.familyNamePrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'given_name_privacy', tableColumns.hashers.givenNamePrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'headshot_privacy', tableColumns.hashers.headshotPrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'in_memoriam_privacy', tableColumns.hashers.inMemoriamPrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'mother_hash_privacy', tableColumns.hashers.motherHashPrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'naming_trail_privacy', tableColumns.hashers.namingTrailPrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'passed_privacy', tableColumns.hashers.passedPrivacy);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'phones', tableColumns.hashers.phones);
  }, errorHandler).then(function() {
    return queryInterface.addColumn('hashers', 'who_made_you_cum_privacy', tableColumns.hashers.whoMadeYouCumPrivacy);
  }, errorHandler).then(function() {
    return new Promise((resolve, reject) => {
      const process = childProcess.fork('./scripts/migrate-directory-info.js');
      process.on('error', reject);
      process.on('exit', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Exited with code ${code}`));
        }
      });
    });
  }, errorHandler);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.removeColumn('hashers', 'addresses').then(function() {
    return queryInterface.removeColumn('hashers', 'birth_day_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'birth_month_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'birth_year_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'died_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'emails');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'family_name_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'given_name_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'headshot_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'in_memoriam_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'mother_hash_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'naming_trail_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'passed_privacy');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'phones');
  }, errorHandler).then(function() {
    return queryInterface.removeColumn('hashers', 'who_made_you_cum_privacy');
  }, errorHandler);
};
