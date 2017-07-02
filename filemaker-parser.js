const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const getFieldsFromMetadata = function(metadata) {
  let fields;
  metadata.forEach(function(parsedFields) {
    fields = parsedFields.FIELD.map(function(field) {
      return field.$.NAME;
    });
  });
  return fields;
};

const parseResultSetWithFields = function(resultSet, fields) {
  const items = [];
  resultSet.forEach(function(rows) {
    rows.ROW.forEach(function(row) {
      const item = {};
      row.COL.forEach(function(column, i) {
        const filteredData = column.DATA.filter(function(data) {
          return data;
        });
        item[fields[i]] = (filteredData.length > 1) ? filteredData.join('; ') : filteredData[0];
      });
      item.RECORDID = row.$.RECORDID;
      items.push(item);
    });
  });
  return items;
};

const writeDataToFile = function(data, filename) {
  const json = JSON.stringify(data);
  const filePath = path.join(__dirname, 'filemaker', filename);
  fs.writeFile(filePath, json, function(error, data) {
    if (error) {
      console.error(`Error while writing ${filename}:`, error);
    } else {
      console.info(`Successfully wrote ${filename}`);
    }
  });
};

fs.readFile(`${__dirname}/filemaker/list-of-members.xml`, function(readError, data) {
  if (readError) {
    console.error('Error while reading list-of-members.xml:', readError);
  } else {
    const parser = new xml2js.Parser();
    parser.parseString(data, function(parseError, result) {
      if (parseError) {
        console.error('Error while parsing list-of-members.xml:', parseError);
      } else {
        writeDataToFile(result, 'list-of-members.json');

        const data = result.FMPXMLRESULT;

        const fields = getFieldsFromMetadata(data.METADATA);
        console.info('Fields in list-of-members.xml:', fields);

        const members = parseResultSetWithFields(data.RESULTSET, fields);
        members.forEach(function(member) {
          console.info('Hasher:', member);
        });
        console.info('Total number of hashers:', members.length);

        const hasherToDatabaseFields = {
          'Address': 'external_address_street',
          'City': 'external_address_city',
          'Country': 'external_address_country',
          'First Name:': 'given_name',
          'First Run #:': 'external_first_trail_number',
          'First Run Date:': 'external_first_trail_date',
          'Hares #:': 'external_hare_count_2',
          'Hares No.': 'external_hare_count_1',
          'Hash Name:': 'hash_name',
          'Last Name:': 'family_name',
          'RECORDID': 'external_id',
          'zct_Runs': 'external_run_count'
        };
        const hashers = members.map(function(member) {
          const hasher = {};
          for (let key in member) {
            const dataKey = hasherToDatabaseFields[key];
            if (dataKey) {
              let dataValue = member[key];
              if (dataKey === 'external_first_trail_date' && dataValue) {
                dataValue = dataValue.replace('012/', '12/');
              }
              const dataShouldBeDate = (dataKey === 'external_first_trail_date');
              const dataShouldBeNumber = (
                dataKey === 'external_hare_count_1' ||
                dataKey === 'external_hare_count_2' ||
                dataKey === 'external_run_count'
              );
              if (dataValue && dataShouldBeNumber) {
                dataValue = parseInt(dataValue, 10);
              }
              hasher[dataKey] = dataValue || (dataShouldBeNumber ? 0 : '');
            }
          }
          return hasher;
        });
        writeDataToFile(hashers, 'hashers.json');
      }
    });
  }
});

fs.readFile(`${__dirname}/filemaker/run-list-all.xml`, function(readError, data) {
  if (readError) {
    console.error('Error while reading the XML file:', readError);
  } else {
    const parser = new xml2js.Parser();
    parser.parseString(data, function(parseError, result) {
      if (parseError) {
        console.error('Error while parsing the XML file:', parseError);
      } else {
        writeDataToFile(result, 'run-list-all.json');

        const data = result.FMPXMLRESULT;

        const fields = getFieldsFromMetadata(data.METADATA);
        console.info('Fields in the file:', fields);

        const runs = parseResultSetWithFields(data.RESULTSET, fields);
        runs.forEach(function(run) {
          console.info('Run:', run);
        });
        console.info('Total number of runs:', runs.length);

        const runToEventFields = {
          'RECORDID': 'external_id',
          'Hare.id.fk': 'hares_md',
          'Hashit_Comment': 'hashit_reason_md',
          'Place': 'location_md',
          'ON ON': 'on_on_md',
          'Run Comments': 'trail_comments_md',
          'Run.Id.pk': 'trail_number',
          'Scribe': 'scribes',
          'Run Date': 'start_datetime'
        };
        const events = runs.map(function(run) {
          const event = {};
          for (let key in run) {
            const dataKey = runToEventFields[key];
            if (dataKey) {
              let dataValue = run[key];
              if (dataKey === 'hashit_reason_md') {
                dataValue = dataValue || run['Hashit.Id'];
              } else if (dataKey === 'start_datetime') {
                if (run.zct_dayofweek === 'Saturday' || run.zct_dayofweek === 'Sunday') {
                  dataValue += ' 10:00 am';
                } else {
                  dataValue += ' 6:30 pm';
                }
                dataValue += ' America/Los_Angeles';
              } else if (dataKey === 'trail_number') {
                dataValue = parseInt(dataValue, 10);
                if (isNaN(dataValue) || dataValue < 1 || dataValue > 2000) {
                  dataValue = 0;
                }
              }
              if (dataValue && dataValue.replace) {
                dataValue = dataValue.replace(/\0/g, '');
              }
              event[dataKey] = dataValue || ((dataKey === 'hashit_id' || dataKey === 'trail_number') ? 0 : '');
            }
          }
          event.snooze_title_md = '';
          if (event.scribes) {
            const scribeSplit = event.scribes.split('--');
            const scribes = scribeSplit.shift().replace(/"/g, "'");
            event.scribes = `{'${scribes}'}`;
            event.snooze_title_md = scribeSplit.join('—');
          } else {
            event.scribes = '{}';
          }
          return event;
        });
        writeDataToFile(events, 'events.json');
      }
    });
  }
});
