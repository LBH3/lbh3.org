'use strict';

function errorHandler(error) {
  console.error(error);
}

let types;

exports.setup = function(options) {
  types = options.dbmigrate.dataType;
};

exports.up = function(db) {
  const intType = {type: types.INTEGER, notNull: true, defaultValue: 0};
  const primaryIntType = {type: types.INTEGER, primaryKey: true, notNull: true, autoIncrement: true};
  const primaryTextType = {type: types.TEXT, primaryKey: true, notNull: true};
  const textArrayType = {type: 'text[]', notNull: true, defaultValue: '{}'};
  const textType = {type: types.TEXT, notNull: true, defaultValue: ''};

  return db.createTable('events', {
    id: primaryIntType,
    bring_md: textType,
    directions_md: textType,
    external_id: textType,
    google_place_id: textType,
    from_the_hares_md: textType,
    hares_md: textType,
    hashit_reason_md: textType,
    location_google_place_id: textType,
    location_md: textType,
    name_md: textType,
    on_on_google_place_id: textType,
    on_on_md: textType,
    photos_url: textType,
    scribes: textArrayType,
    start_datetime: 'timestamptz',
    snooze_title_md: textType,
    snooze_url: textType,
    trail_comments_md: textType,
    trail_number: intType
  }).then(function() {
    return db.createTable('hashers', {
      id: primaryIntType,
      external_address_country: textType,
      external_address_city: textType,
      external_address_street: textType,
      external_first_trail_date: types.DATE,
      external_first_trail_date: types.DATE,
      external_first_trail_number: intType,
      external_hare_count_1: intType,
      external_hare_count_2: intType,
      external_id: textType,
      external_run_count: intType,
      family_name: textType,
      given_name: textType,
      hash_name: textType
    });
  }, errorHandler).then(function() {
    return db.createTable('google_places', {
      id: primaryTextType,
      formatted_address: textType,
      formatted_phone_number: textType,
      geometry_location: 'point',
      geometry_viewport: 'box',
      icon: textType,
      international_phone_number: textType,
      name: textType,
      place_id: textType,
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
      long_name: textType,
      short_name: textType,
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
