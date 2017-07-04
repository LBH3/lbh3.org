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
        // writeDataToFile(result, 'list-of-members.json');

        const data = result.FMPXMLRESULT;

        const fields = getFieldsFromMetadata(data.METADATA);
        console.info('Fields in list-of-members.xml:', fields);

        const members = parseResultSetWithFields(data.RESULTSET, fields);
        members.forEach(function(member) {
          console.info('Hasher:', member);
        });
        console.info('Total number of hashers:', members.length);

        const hasherToDatabaseFields = {
          'Address': 'externalAddressStreet',
          'City': 'externalAddressCity',
          'Country': 'externalAddressCountry',
          'First Name:': 'givenName',
          'First Run #:': 'externalFirstTrailNumber',
          'First Run Date:': 'externalFirstTrailDate',
          'Hares #:': 'externalHareCount2',
          'Hares No.': 'externalHareCount1',
          'Hash Name:': 'hashName',
          'Last Name:': 'familyName',
          'RECORDID': 'externalId',
          'zct_Runs': 'externalRunCount'
        };
        const hashers = members.map(function(member) {
          const hasher = {};
          for (let key in member) {
            const dataKey = hasherToDatabaseFields[key];
            if (dataKey) {
              let dataValue = member[key];
              if (dataKey === 'externalFirstTrailDate' && dataValue) {
                dataValue = dataValue.replace('012/', '12/');
              }
              const dataShouldBeDate = (dataKey === 'externalFirstTrailDate');
              const dataShouldBeNumber = (
                dataKey === 'externalHareCount1' ||
                dataKey === 'externalHareCount2' ||
                dataKey === 'externalRunCount'
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
        // writeDataToFile(result, 'run-list-all.json');

        const data = result.FMPXMLRESULT;

        const fields = getFieldsFromMetadata(data.METADATA);
        console.info('Fields in the file:', fields);

        const runs = parseResultSetWithFields(data.RESULTSET, fields);
        runs.forEach(function(run) {
          console.info('Run:', run);
        });
        console.info('Total number of runs:', runs.length);

        const runToEventFields = {
          'RECORDID': 'externalId',
          'Hare.id.fk': 'haresMd',
          'Hashit_Comment': 'hashitReasonMd',
          'Place': 'locationMd',
          'ON ON': 'onOnMd',
          'Run Comments': 'trailCommentsMd',
          'Run.Id.pk': 'trailNumber',
          'Scribe': 'scribesMd',
          'Run Date': 'startDatetime'
        };
        const events = runs.map(function(run) {
          const event = {
            snoozeTitleMd: ''
          };
          for (let key in run) {
            const dataKey = runToEventFields[key];
            if (dataKey) {
              let dataValue = run[key];
              if (dataKey === 'hashitReasonMd') {
                dataValue = dataValue || run['Hashit.Id'];
              } else if (dataKey === 'scribesMd' && dataValue) {
                const scribeSplit = dataValue.split('--');
                dataValue = scribeSplit.shift();
                event.snoozeTitleMd = scribeSplit.join('—');
              } else if (dataKey === 'startDatetime') {
                if (run.zct_dayofweek === 'Saturday' || run.zct_dayofweek === 'Sunday') {
                  dataValue += ' 10:00 am';
                } else {
                  dataValue += ' 6:30 pm';
                }
                dataValue += ' America/Los_Angeles';
              } else if (dataKey === 'trailNumber') {
                dataValue = parseInt(dataValue, 10);
                if (isNaN(dataValue) || dataValue < 1 || dataValue > 2000) {
                  dataValue = 0;
                }
              }
              if (dataValue && dataValue.replace) {
                // Replace null bytes
                dataValue = dataValue.replace(/\0/g, '');
              }
              event[dataKey] = dataValue || (dataKey === 'trailNumber' ? 0 : '');
            }
          }
          return event;
        });
        writeDataToFile(events, 'events.json');
      }
    });
  }
});
