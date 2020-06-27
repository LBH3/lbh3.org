"use strict";

exports.getDefinitionsWithSequelize = function (Sequelize) {
  const booleanType = (field) => ({
    type: Sequelize.BOOLEAN,
    field,
    notNull: true,
    field,
    defaultValue: false,
  });
  const boxType = (field) => ({ type: Sequelize.GEOMETRY("POLYGON"), field });
  const currentTimestampType = (field) => ({
    type: "timestamp with time zone",
    notNull: true,
    field,
    defaultValue: "now()",
  });
  const dateType = (field) => ({ type: Sequelize.DATEONLY, field });
  const decimalType = (field) => ({ type: Sequelize.DECIMAL, field });
  const enumType = (field, enumValues) => ({
    type: Sequelize.ENUM(enumValues),
    field,
  });
  const intType = (field) => ({
    type: Sequelize.INTEGER,
    notNull: true,
    field,
    defaultValue: 0,
  });
  const jsonType = (field) => ({ type: Sequelize.JSON, field });
  const pointType = (field) => ({ type: Sequelize.GEOMETRY("POINT"), field });
  const primaryIntType = {
    type: Sequelize.INTEGER,
    primaryKey: true,
    notNull: true,
    field: "id",
    autoIncrement: true,
  };
  const primaryStringType = {
    type: Sequelize.STRING,
    primaryKey: true,
    notNull: true,
    field: "id",
  };
  const privacyType = (field) => ({
    type: Sequelize.STRING,
    notNull: true,
    field,
    defaultValue: "bored",
  });
  const stringType = (field) => ({
    type: Sequelize.STRING,
    notNull: true,
    field,
    defaultValue: "",
  });
  const textArrayType = (field) => ({
    type: "text[]",
    notNull: true,
    field,
    defaultValue: "{}",
  });
  const textType = (field) => ({
    type: Sequelize.TEXT,
    notNull: true,
    field,
    defaultValue: "",
  });
  const timestampType = (field) => ({
    type: "timestamp with time zone",
    notNull: true,
    field,
  });

  return {
    ballots: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      electionId: intType("election_id"),
      encryptedBallot: textType("encrypted_ballot"),
      encryptedKey: textType("encrypted_key"),
      hasherId: intType("hasher_id"),
      sha256: stringType("sha256"),
    },
    bored_hashers: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      endDate: dateType("end_date"),
      hasherId: intType("hasher_id"),
      positionId: intType("position_id"),
      startDate: dateType("start_date"),
    },
    bored_positions: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      emailAddress: stringType("email_address"),
      pluralName: stringType("plural_name"),
      singularName: stringType("singular_name"),
      sortPosition: intType("sort_position"),
    },
    bored_years: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      endDate: dateType("end_date"),
      startDate: dateType("start_date"),
      year: intType("year"),
    },
    elections: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      advertise: booleanType("advertise"),
      advertisementMd: stringType("advertisement_md"),
      descriptionMd: textType("description_md"),
      endDatetime: timestampType("end_datetime"),
      endedNoticeMd: stringType("ended_notice_md"),
      publicKey: textType("public_key"),
      schema: jsonType("schema"),
      startDatetime: timestampType("start_datetime"),
      titleMd: stringType("title_md"),
      urlId: stringType("url_id"),
      year: intType("year"),
    },
    events: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      addedWriteupMd: textType("added_writeup_md"),
      additionalWriteupMd: textType("additional_writeup_md"),
      bringMd: textType("bring_md"),
      directionsMd: textType("directions_md"),
      externalId: stringType("external_id"),
      fromTheHaresMd: textType("from_the_hares_md"),
      harePatchesMd: textType("hare_patches_md"),
      haresMd: textType("hares_md"),
      hashitReasonMd: textType("hashit_reason_md"),
      locationGooglePlaceId: stringType("location_google_place_id"),
      locationMd: textType("location_md"),
      miles: decimalType("miles"),
      nameMd: textType("name_md"),
      newBootsMd: textType("new_boots_md"),
      newNamesMd: textType("new_names_md"),
      onOnGooglePlaceId: stringType("on_on_google_place_id"),
      onOnMd: textType("on_on_md"),
      patchesMd: textType("patches_md"),
      photosUrl: textType("photos_url"),
      photosUrlCheckedDatetime: currentTimestampType(
        "photos_url_checked_datetime"
      ),
      photosUrlCheckedStatus: intType("photos_url_checked_status"),
      returnersMd: textType("returners_md"),
      scribesMd: textType("scribes_md"),
      startDatetime: timestampType("start_datetime"),
      snoozeDatePrimary: textType("snooze_date_primary"),
      snoozeDateSecondary: textType("snooze_date_secondary"),
      snoozeTitleMd: textType("snooze_title_md"),
      snoozeUrl: textType("snooze_url"),
      specialEventId: intType("special_event_id"),
      trailCommentsMd: textType("trail_comments_md"),
      trailNumber: intType("trail_number"),
      visitorsMd: textType("visitors_md"),
    },
    events_hashers: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      eventPayment: stringType("event_payment"),
      externalId: stringType("external_id"),
      familyName: stringType("family_name"),
      foodPreference: stringType("food_preference"),
      givenName: stringType("given_name"),
      hasherId: intType("hasher_id"),
      hashName: stringType("hash_name"),
      paymentNotes: stringType("payment_notes"),
      paymentTier: enumType("payment_tier", [
        "5",
        "baby",
        "bored",
        "c",
        "dues",
        "hares",
        "kids",
        "lt",
        "punch",
      ]),
      paymentType: enumType("payment_type", [
        "both",
        "cash",
        "check",
        "no_charge",
      ]),
      role: stringType("role"),
      runPatch: stringType("run_patch"),
      trailNumber: intType("trail_number"),
    },
    events_routes: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      hasherId: intType("hasher_id"),
      metadata: jsonType("metadata"),
      segments: jsonType("segments"),
      trailNumber: intType("trail_number"),
    },
    google_places: {
      id: primaryStringType,
      addressComponents: jsonType("address_components"),
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      formattedAddress: textType("formatted_address"),
      formattedPhoneNumber: stringType("formatted_phone_number"),
      geometryLocation: pointType("geometry_location"),
      geometryViewport: boxType("geometry_viewport"),
      icon: textType("icon"),
      internationalPhoneNumber: stringType("international_phone_number"),
      name: textType("name"),
      placeId: stringType("place_id"),
      reference: textType("reference"),
      scope: stringType("scope"),
      types: textArrayType("types"),
      url: textType("url"),
      vicinity: stringType("vicinity"),
      website: textType("website"),
    },
    hashers: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      addressCountry: stringType("address_country"),
      addressCountryPrivate: stringType("address_country_private"),
      addressCity: stringType("address_city"),
      addressCityPrivate: stringType("address_city_private"),
      addresses: jsonType("addresses"),
      addressState: stringType("address_state"),
      addressStatePrivate: stringType("address_state_private"),
      addressStreet: stringType("address_street"),
      addressStreetPrivate: stringType("address_street_private"),
      addressZipCode: stringType("address_zip_code"),
      addressZipCodePrivate: stringType("address_zip_code_private"),
      alerts: stringType("alerts"),
      awardCount: intType("award_count"),
      birthDay: intType("birth_day"),
      birthDayPrivacy: privacyType("birth_day_privacy"),
      birthMonth: intType("birth_month"),
      birthMonthPrivacy: privacyType("birth_month_privacy"),
      birthYear: intType("birth_year"),
      birthYearPrivacy: privacyType("birth_year_privacy"),
      cellPhone: stringType("cell_phone"),
      cellPhonePrivate: stringType("cell_phone_private"),
      createdBy: stringType("created_by"),
      createdByUserId: intType("created_by_user_id"),
      deathDate: dateType("death_date"),
      died: stringType("died"),
      diedPrivacy: privacyType("died_privacy"),
      emailAddresses: textArrayType("email_addresses"),
      emailAddressesPrivate: textArrayType("email_addresses_private"),
      emailing: stringType("emailing"),
      emails: jsonType("emails"),
      endOfYear: intType("end_of_year"),
      event: stringType("event"),
      externalId: stringType("external_id"),
      familyName: stringType("family_name"),
      familyNamePrivacy: privacyType("family_name_privacy"),
      familyNamePrivate: stringType("family_name_private"),
      fax: stringType("fax"),
      firstTrailDate: dateType("first_trail_date"),
      firstTrailNumber: intType("first_trail_number"),
      foodPreference: stringType("food_preference"),
      givenName: stringType("given_name"),
      givenNamePrivacy: privacyType("given_name_privacy"),
      givenNamePrivate: stringType("given_name_private"),
      hashName: stringType("hash_name"),
      headshotPrivacy: privacyType("headshot_privacy"),
      headshotUrl: textType("headshot_url"),
      history: stringType("history"),
      homePhone: stringType("home_phone"),
      homePhonePrivate: stringType("home_phone_private"),
      inMemoriam: textType("in_memoriam"),
      inMemoriamPrivacy: privacyType("in_memoriam_privacy"),
      lastTrailDate: dateType("last_trail_date"),
      mailHashName: stringType("mail_hash_name"),
      mailName: stringType("mail_name"),
      mia: stringType("mia"),
      motherHash: stringType("mother_hash"),
      motherHashPrivacy: privacyType("mother_hash_privacy"),
      namingTrailDate: dateType("naming_trail_date"),
      namingTrailNumber: intType("naming_trail_number"),
      namingTrailPrivacy: privacyType("naming_trail_privacy"),
      notesMd: textType("notes_md"),
      obituaryMd: textType("obituary_md"),
      owes: stringType("owes"),
      passed: stringType("passed"),
      passedPrivacy: privacyType("passed_privacy"),
      payment: stringType("payment"),
      phones: jsonType("phones"),
      punchCard: intType("punch_card"),
      runCount: intType("run_count"),
      runPatch: intType("run_patch"),
      runSort: intType("run_sort"),
      shirtSize: stringType("shirt_size"),
      shoeSize: stringType("shoe_size"),
      updatedBy: stringType("updated_by"),
      updatedByUserId: intType("updated_by_user_id"),
      waistSize: stringType("waist_size"),
      waiver: stringType("waiver"),
      whoMadeYouCum: textType("who_made_you_cum"),
      whoMadeYouCumPrivacy: privacyType("who_made_you_cum_privacy"),
      workPhone: stringType("work_phone"),
      workPhonePrivate: stringType("work_phone_private"),
    },
    paper_ballots: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      addedById: intType("added_by_id"),
      dateTaken: dateType("date_taken"),
      electionId: intType("election_id"),
      hasherId: intType("hasher_id"),
    },
    patches: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      hasherId: intType("hasher_id"),
      number: intType("number"),
      trailNumber: intType("trail_number"),
      type: enumType("type", ["hare", "run"]),
    },
    special_events: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      descriptionMd: textType("description_md"),
      locationGooglePlaceId: stringType("location_google_place_id"),
      locationMd: textType("location_md"),
      photosUrl: textType("photos_url"),
      startDatetime: timestampType("start_datetime"),
      urlId: stringType("url_id"),
      year: intType("year"),
    },
    users: {
      id: primaryIntType,
      createdAt: currentTimestampType("created_at"),
      updatedAt: currentTimestampType("updated_at"),
      facebookId: stringType("facebook_id"),
      facebookProfile: jsonType("facebook_profile"),
      googleId: stringType("google_id"),
      googleProfile: jsonType("google_profile"),
      hasherId: intType("hasher_id"),
      requestedName: stringType("requested_name"),
    },
  };
};
