'use strict';

function errorHandler(error) {
  console.error(error);
}

let types;

exports.setup = function(options) {
  types = options.dbmigrate.dataType;
};

exports.up = function(db) {
  const currentTimestampType = {type: 'timestamp with time zone', notNull: true, defaultValue: 'now()'};
  const intType = {type: types.INTEGER, notNull: true, defaultValue: 0};
  const primaryIntType = {type: types.INTEGER, primaryKey: true, notNull: true, autoIncrement: true};
  const primaryTextType = {type: types.TEXT, primaryKey: true, notNull: true};
  const textArrayType = {type: 'text[]', notNull: true, defaultValue: '{}'};
  const textType = {type: types.TEXT, notNull: true, defaultValue: ''};

  return db.createTable('events', {
    id: primaryIntType,
    createdAt: currentTimestampType,
    updatedAt: currentTimestampType,
    bringMd: textType,
    directionsMd: textType,
    externalId: textType,
    googlePlaceId: textType,
    FromTheHaresMd: textType,
    haresMd: textType,
    hashitReasonMd: textType,
    locationGooglePlaceId: textType,
    locationMd: textType,
    nameMd: textType,
    onOnGooglePlaceId: textType,
    onOnMd: textType,
    photosUrl: textType,
    scribesMd: textType,
    startDatetime: 'timestamptz',
    snoozeTitleMd: textType,
    snoozeUrl: textType,
    trailCommentsMd: textType,
    trailNumber: intType
  }).then(function() {
    return db.createTable('hashers', {
      id: primaryIntType,
      createdAt: currentTimestampType,
      updatedAt: currentTimestampType,
      externalAddressCountry: textType,
      externalAddressCity: textType,
      externalAddressStreet: textType,
      externalFirstTrailDate: types.DATE,
      externalFirstTrailNumber: textType,
      externalHareCount1: intType,
      externalHareCount2: intType,
      externalId: textType,
      externalRunCount: intType,
      familyName: textType,
      givenName: textType,
      hashName: textType
    });
  }, errorHandler).then(function() {
    return db.createTable('google_places', {
      id: primaryTextType,
      createdAt: currentTimestampType,
      updatedAt: currentTimestampType,
      formattedAddress: textType,
      formattedPhoneNumber: textType,
      geometryLocation: 'point',
      geometryViewport: 'box',
      icon: textType,
      internationalPhoneNumber: textType,
      name: textType,
      placeId: textType,
      reference: textType,
      scope: textType,
      types: textArrayType,
      url: textType,
      vicinity: textType,
      website: textType
    });
  }, errorHandler).then(function() {
    return db.createTable('google_places_address_components', {
      id: primaryIntType,
      createdAt: currentTimestampType,
      updatedAt: currentTimestampType,
      longName: textType,
      shortName: textType,
      types: textArrayType
    });
  }, errorHandler);
};

exports.down = function(db) {
  return db.dropTable('events').then(function() {
    return db.dropTable('hashers');
  }, errorHandler).then(function() {
    return db.dropTable('google_places');
  }, errorHandler).then(function() {
    return db.dropTable('google_places_address_components');
  }, errorHandler);
};

exports._meta = {
  "version": 1
};
