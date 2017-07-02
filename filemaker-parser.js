const fs = require('fs');
const xml2js = require('xml2js');

fs.readFile(`${__dirname}/filemaker/list-of-members.xml`, function(readError, data) {
  if (readError) {
    console.error('Error while reading list-of-members.xml:', readError);
  } else {
    const parser = new xml2js.Parser();
    parser.parseString(data, function(parseError, result) {
      if (parseError) {
        console.error('Error while parsing list-of-members.xml:', parseError);
      } else {
        const json = JSON.stringify(result);
        fs.writeFile(`${__dirname}/filemaker/list-of-members.json`, json, function(writeError, data) {
          if (parseError) {
            console.error('Error while writing list-of-members.json:', writeError);
          } else {
            console.info('Successfully wrote list-of-members.json');
          }
        });

        const data = result.FMPXMLRESULT;
        const metadata = data.METADATA;
        let fields;
        const hashers = [];
        metadata.forEach(function(parsedFields) {
          fields = parsedFields.FIELD.map(function(field) {
            return field.$.NAME;
          });
        });
        console.info('Fields in list-of-members.xml:', fields);
        data.RESULTSET.forEach(function(rows) {
          rows.ROW.forEach(function(row) {
            const hasher = {};
            row.COL.forEach(function(column, i) {
              const filteredData = column.DATA.filter(function(data) {
                return data;
              });
              hasher[fields[i]] = (filteredData.length > 1) ? filteredData.join('; ') : filteredData[0];
            });
            hasher.RECORDID = row.$.RECORDID;
            console.info('Hasher:', hasher);
            hashers.push(hasher);
          });
        });
        console.info('Total number of hashers:', hashers.length);
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
        const json = JSON.stringify(result);
        fs.writeFile(`${__dirname}/filemaker/run-list-all.json`, json, function(writeError, data) {
          if (parseError) {
            console.error('Error while writing the JSON file:', writeError);
          } else {
            console.info('Successfully wrote the JSON file');
          }
        });

        const data = result.FMPXMLRESULT;
        const metadata = data.METADATA;
        let fields;
        const runs = [];
        metadata.forEach(function(parsedFields) {
          fields = parsedFields.FIELD.map(function(field) {
            return field.$.NAME;
          });
        });
        console.info('Fields in the file:', fields);
        data.RESULTSET.forEach(function(rows) {
          rows.ROW.forEach(function(row) {
            const run = {};
            row.COL.forEach(function(column, i) {
              const filteredData = column.DATA.filter(function(data) {
                return data;
              });
              run[fields[i]] = (filteredData.length > 1) ? filteredData.join('; ') : filteredData[0];
            });
            run.RECORDID = row.$.RECORDID;
            console.info('Run:', run);
            runs.push(run);
          });
        });
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
        console.info('Total number of runs:', runs.length);
        const events = runs.map(function(run) {
          let event = {};
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
        const eventsJSON = JSON.stringify(events);
        fs.writeFile(`${__dirname}/filemaker/events.json`, eventsJSON, function(writeError, data) {
          if (parseError) {
            console.error('Error while writing events.json:', writeError);
          } else {
            console.info('Successfully wrote events.json');
          }
        });
      }
    });
  }
});
