'use strict';

function errorHandler(error) {
  console.error(error);
}

exports.up = function (queryInterface, Sequelize) {
  const currentTimestampType = {type: 'timestamp with time zone', notNull: true, defaultValue: 'now()'};
  const intType = {type: Sequelize.INTEGER, notNull: true, defaultValue: 0};
  const primaryIntType = {type: Sequelize.INTEGER, primaryKey: true, notNull: true, autoIncrement: true};
  const primaryTextType = {type: Sequelize.TEXT, primaryKey: true, notNull: true};
  const stringType = {type: Sequelize.STRING, notNull: true, defaultValue: ''};
  const textArrayType = {type: 'text[]', notNull: true, defaultValue: '{}'};
  const textType = {type: Sequelize.TEXT, notNull: true, defaultValue: ''};

  return queryInterface.createTable('events', {
    id: primaryIntType,
    createdAt: currentTimestampType,
    updatedAt: currentTimestampType,
    bringMd: textType,
    directionsMd: textType,
    externalId: stringType,
    googlePlaceId: stringType,
    FromTheHaresMd: textType,
    haresMd: textType,
    hashitReasonMd: textType,
    locationGooglePlaceId: stringType,
    locationMd: textType,
    nameMd: textType,
    onOnGooglePlaceId: stringType,
    onOnMd: textType,
    photosUrl: textType,
    scribesMd: textType,
    startDatetime: 'timestamptz',
    snoozeTitleMd: textType,
    snoozeUrl: textType,
    trailCommentsMd: textType,
    trailNumber: intType
  }).then(function() {
    return queryInterface.createTable('hashers', {
      id: primaryIntType,
      createdAt: currentTimestampType,
      updatedAt: currentTimestampType,
      externalAddressCountry: stringType,
      externalAddressCity: stringType,
      externalAddressStreet: stringType,
      externalFirstTrailDate: Sequelize.DATE,
      externalFirstTrailNumber: stringType,
      externalHareCount1: intType,
      externalHareCount2: intType,
      externalId: stringType,
      externalRunCount: intType,
      familyName: stringType,
      givenName: stringType,
      hashName: stringType
    });
  }, errorHandler).then(function() {
    return queryInterface.createTable('google_places', {
      id: primaryTextType,
      createdAt: currentTimestampType,
      updatedAt: currentTimestampType,
      formattedAddress: textType,
      formattedPhoneNumber: stringType,
      geometryLocation: 'point',
      geometryViewport: 'box',
      icon: textType,
      internationalPhoneNumber: stringType,
      name: textType,
      placeId: stringType,
      reference: stringType,
      scope: stringType,
      types: textArrayType,
      url: textType,
      vicinity: stringType,
      website: textType
    });
  }, errorHandler).then(function() {
    return queryInterface.createTable('google_places_address_components', {
      id: primaryIntType,
      createdAt: currentTimestampType,
      updatedAt: currentTimestampType,
      longName: textType,
      shortName: stringType,
      types: textArrayType
    });
  }, errorHandler).then(function() {
    return queryInterface.createTable('users', {
      id: primaryIntType,
      createdAt: currentTimestampType,
      updatedAt: currentTimestampType,
      facebookId: stringType
    });
  }, errorHandler);
};

exports.down = function (queryInterface, Sequelize) {
  return queryInterface.dropTable('events').then(function() {
    return queryInterface.dropTable('hashers');
  }, errorHandler).then(function() {
    return queryInterface.dropTable('google_places');
  }, errorHandler).then(function() {
    return queryInterface.dropTable('google_places_address_components');
  }, errorHandler);
};
