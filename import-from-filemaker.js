const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  database: 'lbh3'
});

client.connect();

fs.readFile(`${__dirname}/filemaker/events.json`, function(readError, data) {
  if (readError) {
    console.error('Error while reading events.json:', readError);
  } else {
    const events = JSON.parse(data);
    const fields = [];
    for (let key in events[0]) {
      fields.push(key);
    }
    const insertQuery = fields.join(', ');
    const insertValues = fields.map(function(field, index) {
      return '$' + (index + 1);
    });
    let executedQueryCount = 0;
    const incrementAndCheckCount = function() {
      executedQueryCount += 1;
      if (executedQueryCount === events.length) {
        client.end();
        console.info('Finished inserting events!');
      }
    };
    events.forEach(function(event) {
      const eventValues = Object.values(event);
      const whereClause = `WHERE external_id = '${event.external_id}'`;
      client.query(`SELECT id FROM events ${whereClause}`, (error, response) => {
        if ((error && error.code === '42703') || (response && response.rowCount === 0)) {
          client.query(`INSERT INTO events (${insertQuery}) VALUES (${insertValues})`, eventValues, (error, response) => {
            if (error) {
              console.info('Event values:', eventValues);
              console.error('Insert failed:', error);
            }
            incrementAndCheckCount();
          });
        } else if (error) {
          console.info('Event values:', eventValues);
          console.error('Select failed:', error);
          incrementAndCheckCount();
        } else {
          client.query(`UPDATE events SET (${insertQuery}) = (${insertValues}) ${whereClause}`, eventValues, (error, response) => {
            if (error) {
              console.info('Event values:', eventValues);
              console.error('Update failed:', error);
            }
            incrementAndCheckCount();
          });
        }
      });
    });
  }
});
