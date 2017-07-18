'use strict';

exports.getDefinitionsWithSequelize = function (Sequelize) {
  const boxType = field => ({type: Sequelize.GEOMETRY('POLYGON'), field});
  const currentTimestampType = field => ({type: 'timestamp with time zone', notNull: true, field, defaultValue: 'now()'});
  const dateType = field => ({type: Sequelize.DATE, field});
  const intType = field => ({type: Sequelize.INTEGER, notNull: true, field, defaultValue: 0});
  const jsonType = field => ({type: Sequelize.JSON, field});
  const pointType = field => ({type: Sequelize.GEOMETRY('POINT'), field});
  const primaryIntType = {type: Sequelize.INTEGER, primaryKey: true, notNull: true, field: 'id', autoIncrement: true};
  const primaryStringType = {type: Sequelize.STRING, primaryKey: true, notNull: true, field: 'id'};
  const stringType = field => ({type: Sequelize.STRING, notNull: true, field, defaultValue: ''});
  const textArrayType = field => ({type: 'text[]', notNull: true, field, defaultValue: '{}'});
  const textType = field => ({type: Sequelize.TEXT, notNull: true, field, defaultValue: ''});
  const timestampType = field => ({type: 'timestamp with time zone', notNull: true, field});

  return {
    events: {
      id: primaryIntType,
      createdAt: currentTimestampType('created_at'),
      updatedAt: currentTimestampType('updated_at'),
      bringMd: textType('bring_md'),
      directionsMd: textType('directions_md'),
      externalId: stringType('external_id'),
      fromTheHaresMd: textType('from_the_hares_md'),
      haresMd: textType('hares_md'),
      hashitReasonMd: textType('hashit_reason_md'),
      locationGooglePlaceId: stringType('location_google_place_id'),
      locationMd: textType('location_md'),
      nameMd: textType('name_md'),
      onOnGooglePlaceId: stringType('on_on_google_place_id'),
      onOnMd: textType('on_on_md'),
      photosUrl: textType('photos_url'),
      scribesMd: textType('scribes_md'),
      startDatetime: timestampType('start_datetime'),
      snoozeTitleMd: textType('snooze_title_md'),
      snoozeUrl: textType('snooze_url'),
      trailCommentsMd: textType('trail_comments_md'),
      trailNumber: intType('trail_number')
    },
    google_places: {
      id: primaryStringType,
      addressComponents: jsonType('address_components'),
      createdAt: currentTimestampType('created_at'),
      updatedAt: currentTimestampType('updated_at'),
      formattedAddress: textType('formatted_address'),
      formattedPhoneNumber: stringType('formatted_phone_number'),
      geometryLocation: pointType('geometry_location'),
      geometryViewport: boxType('geometry_viewport'),
      icon: textType('icon'),
      internationalPhoneNumber: stringType('international_phone_number'),
      name: textType('name'),
      placeId: stringType('place_id'),
      reference: stringType('reference'),
      scope: stringType('scope'),
      types: textArrayType('types'),
      url: textType('url'),
      vicinity: stringType('vicinity'),
      website: textType('website')
    },
    hashers: {
      id: primaryIntType,
      createdAt: currentTimestampType('created_at'),
      updatedAt: currentTimestampType('updated_at'),
      externalAddressCountry: stringType('external_address_country'),
      externalAddressCity: stringType('external_address_city'),
      externalAddressStreet: stringType('external_address_street'),
      externalFirstTrailDate: dateType('external_first_trail_date'),
      externalFirstTrailNumber: stringType('external_first_trail_number'),
      externalHareCount1: intType('external_hare_count_1'),
      externalHareCount2: intType('external_hare_count_2'),
      externalId: stringType('external_id'),
      externalRunCount: intType('external_run_count'),
      familyName: stringType('family_name'),
      givenName: stringType('given_name'),
      hashName: stringType('hash_name')
    },
    users: {
      id: primaryIntType,
      createdAt: currentTimestampType('created_at'),
      updatedAt: currentTimestampType('updated_at'),
      facebookId: stringType('facebook_id')
    }
  };
};
