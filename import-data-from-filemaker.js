const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const through = require('through');
const XMLStream = require('xml-stream');

const hashRecordToDatabaseFields = {
  'Event pay': 'event_payment',
  'First Name': 'given_name',
  'Food': 'food_preference',
  'Hash.id.fk': 'hasher_id',
  'Hasher Name': 'hash_name',
  'Last Name': 'family_name',
  'Payment': 'payment_notes',
  'Payment Type': 'payment_type',
  'Role': 'role',
  'Run Patch': 'run_patch',
  'Runs.id.fk': 'trail_number',
  'sum_5': 'payment_tier',
  'RECORDID': 'external_id'
};
const hasherToDatabaseFields = {
  "Address": "address_street",
  "Address no Directory": "address_street_private",
  "Alerts": "alerts",
  "Award": "award_count",// or Award Comments
  "Cell Pager": "cell_phone",
  "Cell Pager No directory": "cell_phone_private",
  "City": "address_city",
  "City No Directory": "address_city_private",
  "Country": "address_country",
  "Country no Directory": "address_country_private",
  "Created By": "created_by",
  "Date Created": "created_at",
  "Date Modified": "updated_at",
  "Died": "died",
  "E Mailing": "emailing",
  "Email 1": "email_addresses",// Include “Email 2”
  "Email 1 no directory": "email_addresses_private",// Include “Email 2 No Directory”
  "End of Year": "end_of_year",
  "Event:": "event",
  "Fax": "fax",
  "First Name No Directory": "given_name_private",
  "First Name:": "given_name",
  "First Run #:": "first_trail_number",
  "First Run Date:": "first_trail_date",
  "Food": "food_preference",
  "Hares #:": "hare_count_2",
  "Hares No.": "hare_count_1",
  "Hash Mail Name": "mail_hash_name",
  "Hash Name:": "hash_name",
  "Hash.id_pk": "id",
  "History": "history",
  "Home Phone": "home_phone",
  "Home Phone no directory": "home_phone_private",
  "IN MEMORIUM:": "in_memoriam",
  "Last Name No Directory": "family_name_private",
  "Last Name:": "family_name",
  "Last Run:": "last_trail_date",// or zcd_LastRun
  "Mail Name:": "mail_name",
  "MIA": "mia",
  "Miles:": "miles",
  "Modified By:": "updated_by",
  "Mother Hash:": "mother_hash",
  "Naming Run #:": "naming_trail_number",
  "Naming Run Date:": "naming_trail_date",
  "Notes": "notes_md",
  "Owes": "owes",
  "Passed": "passed",
  "Payment": "payment",
  "Punch Card": "punch_card",
  "Run Patch": "run_patch",
  "Run Sort": "run_sort",
  "Shirt": "shirt_size",
  "Shoe": "shoe_size",
  "State": "address_state",
  "State No Directory": "address_state_private",
  "Total Runs": "run_count",// or zct_Events or zct_Runs
  "Waist": "waist_size",
  "Waiver": "waiver",
  "Who Made U Cum:": "who_made_you_cum",
  "Work Phone": "work_phone",
  "Work Phone No directory": "work_phone_private",
  "z_Bday": "birth_day",
  "zct_Runs_Miles": "run_mileage",
  "Zip Code": "address_zip_code",
  "Zip Code No directory": "address_zip_code_private",
  'RECORDID': 'external_id'
};
const runToEventFields = {
  'Additional writeup': 'additional_writeup_md',
  'Count': 'hashers_total',
  'Date Snooze': 'snooze_date_primary',
  'Hare Patches': 'hare_patches_md',
  'Hare.id.fk': 'hares_md',
  'Hashit_Comment': 'hashit_reason_md',
  'Miles': 'miles',
  'ON ON': 'on_on_md',
  'Patches': 'patches_md',
  'Place': 'location_md',
  'Run Comments': 'trail_comments_md',
  'Run Date': 'start_datetime',
  'Run.Id.pk': 'trail_number',
  'Scribe': 'scribes_md',
  'xxxxAdded WriteUp': 'added_writeup_md',
  'xxxxNew Boots': 'new_boots_md',
  'xxxxNew Names': 'new_names_md',
  'xxxxReturners': 'returners_md',
  'xxxxVisitors': 'visitors_md',
  'zct_Snooze_Date': 'snooze_date_secondary',
  'RECORDID': 'external_id'
};

const client = new Client({
  database: 'lbh3'
});
client.connect();

/* Read the command’s arguments */
const whatToImport = process.argv[2];// Required
if (!whatToImport) {
  throw new Error('What would you like to import?');
}

if (whatToImport === 'runs') {
  importRuns().then(function() {
    console.info('Successfully imported runs!');
    client.end();
  }, function(error) {
    console.error('Failed to import runs with error:', error);
  });
}

if (whatToImport === 'hashers') {
  importHashers().then(function() {
    console.info('Successfully imported hashers!');
    client.end();
  }, function(error) {
    console.error('Failed to import hashers with error:', error);
  });
}

if (whatToImport === 'hash-records') {
  importHashRecords().then(function() {
    console.info('Successfully imported hash records!');
    client.end();
  }, function(error) {
    console.error('Failed to import hasher records with error:', error);
  });
}

function addRowToDatabase({fields, insertQuery, insertValues, reject, resolve, row, rowValues, tableName}) {
  client.query(`INSERT INTO ${tableName} (${insertQuery}) VALUES (${insertValues})`, rowValues, (error, response) => {
    if (error) {
      console.info('tableName:', tableName);
      console.info('row:', row);
      console.info('insertQuery:', fields.length, insertQuery);
      console.info('insertValues:', insertValues.length, insertValues);
      console.error('Row insert error:', error);
      reject(error);
    } else {
      resolve(response);
    }
  });
}

function addOrUpdateRowInDatabase(tableName, row, whereClause) {
  return new Promise(function(resolve, reject) {
    const fields = [];
    for (let key in row) {
      fields.push(key);
    }
    const insertQuery = fields.join(', ');
    const insertValues = fields.map(function(field, index) {
      return '$' + (index + 1);
    });
    const rowValues = Object.values(row);
    if (whereClause) {
      client.query(`SELECT id FROM ${tableName} ${whereClause}`, (error, response) => {
        if ((error && error.code === '42703') || (response && response.rowCount === 0)) {
          addRowToDatabase({fields, insertQuery, insertValues, reject, resolve, row, rowValues, tableName});
        } else if (error) {
          console.info('Bad row values:', rowValues);
          reject(error);
        } else {
          client.query(`UPDATE ${tableName} SET (${insertQuery}) = (${insertValues}) ${whereClause}`, rowValues, (error, response) => {
            if (error) {
              console.info('tableName:', tableName);
              console.info('row:', row);
              console.info('insertQuery:', fields.length, insertQuery);
              console.info('insertValues:', insertValues.length, insertValues);
              console.error('Row update error:', error);
              reject(error);
            } else {
              resolve(response);
            }
          });
        }
      });
    } else {// Force insert
      addRowToDatabase({fields, insertQuery, insertValues, reject, resolve, row, rowValues, tableName});
    }
  });
}

function addHasherToDatabase(hasher) {
  return addOrUpdateRowInDatabase('hashers', hasher);
}

function addHashRecordToDatabase(hashRecord) {
  return addOrUpdateRowInDatabase('events_hashers', hashRecord);
}

function addRunToDatabase(run) {
  const whereClause = `WHERE external_id = '${run.external_id}' OR trail_number = '${run.trail_number}'`;
  return addOrUpdateRowInDatabase('events', run, whereClause);
}

function getFieldsFromMetadata(metadata) {
  let fields;
  metadata.forEach(function(parsedFields) {
    fields = parsedFields.FIELD.map(function(field) {
      return field.$.NAME;
    });
  });
  return fields;
}

function importFile({addRecordToDatabase, fileName, processRecord}) {
  console.info(`Importing ${fileName}`);
  return new Promise(function(resolve, reject) {
    const endRow = '</ROW>';
    const startRow = '<ROW';
    let remainder = '';
    const stream = fs.createReadStream(fileName).pipe(through(function(buffer) {
      const dirtyData = buffer.toString();
      const cleanData = dirtyData.replace(/\0/g, '').replace(/<\/COL><\/DATA><\/COL>/g, '</COL>');
      const splitRows = cleanData.split(`${endRow}${startRow}`);
      const splitRowsLength = splitRows.length;
      for (let i = 0; i < splitRowsLength; i++) {
        let joinedRow = '';
        const row = splitRows[i];
        if (i === 0) {
          joinedRow = `${remainder}${row}${endRow}`;
        } else if (i === (splitRowsLength - 1)) {
          remainder = `${startRow}${row}`;
        } else {
          joinedRow = `${startRow}${row}${endRow}`;
        }
        if (joinedRow) {
          if (joinedRow.indexOf('245723') > -1) {
            joinedRow = `<ROW MODID="4" RECORDID="245723"><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA>1</DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA>J</DATA></COL><COL><DATA></DATA></COL><COL><DATA>76</DATA></COL><COL><DATA>LITTLE WHOPPER</DATA></COL><COL><DATA>243269</DATA></COL><COL><DATA>BROOKS</DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA>Runner</DATA></COL><COL><DATA>4184</DATA></COL><COL><DATA></DATA></COL><COL><DATA>678</DATA></COL><COL><DATA>9</DATA></COL><COL><DATA></DATA></COL><COL><DATA>-31364</DATA></COL><COL><DATA>1</DATA></COL><COL><DATA>5444</DATA></COL><COL><DATA>1</DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA>15370</DATA></COL><COL><DATA>13263</DATA></COL><COL><DATA>-156820</DATA></COL><COL><DATA>1698</DATA></COL><COL><DATA>135126</DATA></COL><COL><DATA></DATA></COL><COL><DATA>-141859</DATA></COL><COL><DATA>135345</DATA></COL><COL><DATA></DATA></COL><COL><DATA>356</DATA></COL><COL><DATA>4421</DATA></COL><COL><DATA>23</DATA></COL><COL><DATA>3704</DATA></COL><COL><DATA>1717</DATA></COL><COL><DATA>3074</DATA></COL><COL><DATA>566</DATA></COL><COL><DATA>274</DATA></COL><COL><DATA>17279</DATA></COL><COL><DATA>-5394</DATA></COL><COL><DATA>735234</DATA></COL><COL><DATA></DATA></COL><COL><DATA>0</DATA></COL><COL><DATA>0</DATA></COL><COL><DATA>Check-Out</DATA></COL><COL><DATA>Check-In</DATA></COL></ROW>`;
          }
          if (joinedRow.indexOf('246888') > -1) {
            joinedRow = `<ROW MODID="4" RECORDID="246888"><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA>1</DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA>CHRIS</DATA></COL><COL><DATA></DATA></COL><COL><DATA>13</DATA></COL><COL><DATA>PMS ( Paddle Me Silly)</DATA></COL><COL><DATA>244434</DATA></COL><COL><DATA>BRADLEY</DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA>Runner</DATA></COL><COL><DATA>4184</DATA></COL><COL><DATA></DATA></COL><COL><DATA>686</DATA></COL><COL><DATA>9</DATA></COL><COL><DATA></DATA></COL><COL><DATA>-31341</DATA></COL><COL><DATA>1</DATA></COL><COL><DATA>5444</DATA></COL><COL><DATA>1</DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA></DATA></COL><COL><DATA>15370</DATA></COL><COL><DATA>13263</DATA></COL><COL><DATA>-156705</DATA></COL><COL><DATA>1698</DATA></COL><COL><DATA>135126</DATA></COL><COL><DATA></DATA></COL><COL><DATA>-141744</DATA></COL><COL><DATA>135345</DATA></COL><COL><DATA></DATA></COL><COL><DATA>356</DATA></COL><COL><DATA>4421</DATA></COL><COL><DATA>23</DATA></COL><COL><DATA>3704</DATA></COL><COL><DATA>1717</DATA></COL><COL><DATA>3074</DATA></COL><COL><DATA>566</DATA></COL><COL><DATA>274</DATA></COL><COL><DATA>17279</DATA></COL><COL><DATA>-5371</DATA></COL><COL><DATA>735234</DATA></COL><COL><DATA></DATA></COL><COL><DATA>0</DATA></COL><COL><DATA>0</DATA></COL><COL><DATA>Check-Out</DATA></COL><COL><DATA>Check-In</DATA></COL></ROW>`;
          }
          this.emit('data', joinedRow);
        }
      }
    }));
    const xmlParser = new XMLStream(stream);

    xmlParser.collect('FIELD');
    let fields;
    xmlParser.on('endElement: METADATA', function(metadata) {
      fields = metadata.FIELD.map(function(field) {
        return field.$.NAME;
      });
      console.info(`Found ${fields.length} fields`);
    });

    const fieldValues = {};
    const promises = [];
    xmlParser.collect('COL');
    xmlParser.collect('DATA');
    xmlParser.on('error', function(error) {
      console.error('XML parser error:', error);
    });
    let completedCounter = 0;
    let totalCounter = 0;
    xmlParser.on('endElement: ROW', function(row) {
      try {
        const record = parseRowWithFields(row, fields);
        const processedRecord = processRecord(record);
        if (processedRecord) {
          console.info(`Adding ${processedRecord.external_id} to the database`);
          addRecordToDatabase(processedRecord).then(function() {
            completedCounter += 1;
          }, reject);
          totalCounter += 1;
        }
      } catch (error) {
        reject(error);
      }
    });

    xmlParser.on('end', function() {
      console.info(`Waiting on ${totalCounter} promises`);
      const interval = setInterval(function() {
        if (completedCounter === totalCounter) {
          console.info(`Finished ${totalCounter} promises`);
          clearInterval(interval);
          resolve();
        } else {
          console.info(`${completedCounter}/${totalCounter} promises complete`);
        }
      }, 1000);
    });
  });
}

function importHashRecords() {
  return importFile({
    addRecordToDatabase: addHashRecordToDatabase,
    fileName: './filemaker/all-hasher.xml',
    processRecord: processXMLRecord(hashRecordToDatabaseFields, processHashRecords)
  });
}

function importHashers() {
  const processRecord = processXMLRecord(hasherToDatabaseFields, processHasher);
  return importFile({
    addRecordToDatabase: addHasherToDatabase,
    fileName: './filemaker/all-hash-records.xml',
    processRecord: function(xmlRecord) {
      const processedRecord = processRecord(xmlRecord);
      return (processedRecord && processedRecord.id) ? processedRecord : null;
    }
  });
}

function importRuns() {
  console.info('Importing runs…');
  return importFile({
    addRecordToDatabase: addRunToDatabase,
    fileName: './filemaker/all-runs.xml',
    processRecord: processXMLRecord(runToEventFields, processRun)
  });
}

function parseRowWithFields(row, fields) {
  const item = {};
  row.COL.forEach(function(column, i) {
    if (column.DATA.filter) {
      const filteredData = column.DATA.filter(function(data) {
        return data;
      });
      item[fields[i]] = (filteredData.length > 1) ? filteredData.join('; ') : filteredData[0];
    } else {
      item[fields[i]] = column.DATA;
    }
  });
  item.RECORDID = row.$.RECORDID;
  return item;
}

const hasherDateFields = [
  'created_at',
  'first_trail_date',
  'last_trail_date',
  'naming_trail_date',
  'updated_at'
];
const hasherDecimalFields = [
  'miles',
  'run_mileage'
];
const hasherIntegerFields = [
  'award_count',
  'end_of_year',
  'first_trail_number',
  'hare_count_1',
  'hare_count_2',
  'id',
  'naming_trail_number',
  'punch_card',
  'run_count',
  'run_patch',
  'run_sort'
];
function processHasher({dbKey, dbRow, xmlKey, xmlRecord, xmlValue}) {
  if (dbKey === 'award_count') {
    xmlValue = anyOfValues([xmlValue, xmlRecord['Award Comments']]);

  } else if (dbKey === 'birth_day') {
    let birthDate = new Date(xmlValue);
    let birthDay, birthMonth, birthYear;

    if (birthDate.toString() === 'Invalid Date') {
      const birthDayAndMonth = xmlRecord['Birth day:'];
      if (birthDayAndMonth) {
        const birthSplit = birthDayAndMonth.split('/');
        birthDay = parseInt(birthSplit[1]);
        birthMonth = parseInt(birthSplit[0]);
        birthYear = parseInt(birthSplit[2]);
      }

      birthYear = (birthYear) ? birthYear : parseValueAsInteger(xmlRecord['Birth Year']);

    } else {
      birthDay = birthDate.getUTCDate();
      birthMonth = birthDate.getUTCMonth() + 1;
      birthYear = birthDate.getUTCFullYear();
    }

    if (birthDay > 0 && birthDay <= 31) {
      dbRow.birth_day = birthDay;
    }
    if (birthMonth > 0 && birthMonth <= 12) {
      dbRow.birth_month = birthMonth;
    }
    if (birthYear > 1900 && birthYear <= 2017) {
      dbRow.birth_year = birthYear;
    }
    return;

  } else if (dbKey === 'email_addresses') {
    xmlValue = [xmlValue, xmlRecord['Email 2']].filter(email => email);

  } else if (dbKey === 'email_addresses_private') {
    xmlValue = [xmlValue, xmlRecord['Email 2 No Directory']].filter(email => email);

  } else if (dbKey === 'last_trail_date') {
    xmlValue = anyOfValues([xmlValue, xmlRecord['zcd_LastRun']]);

  } else if (dbKey === 'run_count') {
    xmlValue = anyOfValues([xmlValue, xmlRecord['zct_Events'], xmlRecord['zct_Runs']]);
  }

  if (hasherDateFields.indexOf(dbKey) > -1) {
    xmlValue = parseValueAsDate(xmlValue) || '';
  } else if (hasherDecimalFields.indexOf(dbKey) > -1) {
    return parseValueAsDecimal(xmlValue) || 0;
  } else if (hasherIntegerFields.indexOf(dbKey) > -1) {
    return parseValueAsInteger(xmlValue) || 0;
  }

  if (dbKey === 'created_at' || dbKey === 'updated_at') {
    if (!xmlValue) {
      if (dbKey === 'created_at') {
        xmlValue = parseValueAsDate(xmlRecord['Date Modified']);
      } else if (dbKey === 'updated_at') {
        xmlValue = parseValueAsDate(xmlRecord['Date Created']);
      }
    }
    if (xmlValue && xmlValue.length) {
      if (xmlValue.length <= 10) {
        xmlValue += ' 12:00 pm';
      }
      const dateString = new Date(xmlValue).toString().slice(3, -14).trim();
      return dateString;
    }
    return undefined;

  }

  return xmlValue || undefined;
}

const hashRecordIntegerFields = [
  'hasher_id',
  'trail_number'
];
const paymentTierEnumMap = {
  sum_5: '5',
  sum_Baby: 'baby',
  sum_bored: 'bored',
  sum_C: 'c',
  sum_dues: 'dues',
  sum_Hares: 'hares',
  sum_Kids: 'kids',
  sum_LT: 'lt',
  sum_punch: 'punch'
};
const paymentTypeEnumMap = {
  'Both': 'both',
  'Cash': 'cash',
  'Check': 'check',
  'No Charge': 'no_charge'
};

function processHashRecords({dbKey, dbRow, xmlKey, xmlRecord, xmlValue}) {
  if (hashRecordIntegerFields.indexOf(dbKey) > -1) {
    return parseValueAsInteger(xmlValue) || 0;
  }

  if (dbKey === 'payment_tier') {
    const enumValues = [];
    for (let paymentTierEnumKey in paymentTierEnumMap) {
      if (xmlRecord[paymentTierEnumKey] == 1) {
        enumValues.push(paymentTierEnumKey);
      }
    }
    if (enumValues.length > 1) {
      console.info('Errant record:', xmlRecord);
      throw new Error(`Enum value violation: ${enumValues.join(', ')}`);
    }
    return paymentTierEnumMap[enumValues[0]] || null;

  } else if (dbKey === 'payment_type') {
    return paymentTypeEnumMap[xmlValue] || null;
  }

  return xmlValue || '';
}

const eventDateFields = ['start_datetime'];
const eventDecimalFields = ['miles'];
const eventIntegerFields = ['hashers_total', 'trail_number'];

function processRun({dbKey, dbRow, xmlKey, xmlRecord, xmlValue}) {
  if (eventDateFields.indexOf(dbKey) > -1) {
    xmlValue = parseValueAsDate(xmlValue) || '';
  } else if (eventDecimalFields.indexOf(dbKey) > -1) {
    xmlValue = parseValueAsDecimal(xmlValue);
  } else if (eventIntegerFields.indexOf(dbKey) > -1) {
    xmlValue = parseValueAsInteger(xmlValue);
  }

  if (dbKey === 'hashit_reason_md') {
    const possibleValues = [xmlValue, xmlRecord['Hashit_Name'], xmlRecord['Hashit.Id']];
    const filteredValues = possibleValues.filter(function(value) {
      return value;
    });
    xmlValue = (filteredValues.length > 1) ? filteredValues.join('; ') : filteredValues[0] || '';

  } else if (dbKey === 'scribes_md' && xmlValue) {
    const scribeSplit = xmlValue.split('--');
    xmlValue = scribeSplit.shift();
    dbRow.snooze_title_md = scribeSplit.join('—');

  } else if (dbKey === 'start_datetime') {
    if (xmlRecord.zct_dayofweek === 'Saturday' || xmlRecord.zct_dayofweek === 'Sunday') {
      xmlValue += ' 10:00 am';
    } else {
      xmlValue += ' 6:30 pm';
    }
    xmlValue += ' America/Los_Angeles';

  } else if (dbKey === 'trail_number') {
    if (xmlValue < 1 || xmlValue > 2000) {
      xmlValue = 0;
    }
  }

  return xmlValue;
}

function processXMLRecord(dbFields, processFunction) {
  return function(xmlRecord) {
    const dbRow = {};
    for (let xmlKey in dbFields) {
      const dbKey = dbFields[xmlKey];
      const xmlValue = xmlRecord[xmlKey];
      let dbValue = processFunction({
        dbKey,
        dbRow,
        xmlKey,
        xmlRecord,
        xmlValue
      })
      if (dbValue && dbValue.replace) {
        // Replace null bytes
        dbValue = dbValue.replace(/\0/g, '');
        // Replace double hyphens with em dashes
        dbValue = dbValue.replace(new RegExp('--', 'g'), '—');
      }
      if (dbValue !== undefined) {
        dbRow[dbKey] = dbValue;
      }
    }
    return dbRow;
  };
}

function anyOfValues(values) {
  for (let index in values) {
    if (values[index]) {
      return values[index];
    }
  }
}

function parseValueAsDate(date) {
  return (date) ? date.replace('012/', '12/') : '';
}

function parseValueAsDecimal(decimal) {
  return parseFloat(decimal) || 0;
}

function parseValueAsInteger(integer) {
  return parseInt(integer, 10) || 0;
}
