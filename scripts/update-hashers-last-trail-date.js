const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const through = require('through');
const XMLStream = require('xml-stream');

const client = new Client({
  database: 'lbh3'
});
client.connect();

client.query(`SELECT id FROM hashers`, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`${response.rows.length} hashers`);
    response.rows.forEach(row => {
      const query = `SELECT e.start_datetime FROM events e JOIN events_hashers eh ON e.trail_number = eh.trail_number WHERE hasher_id = ${row.id} ORDER BY e.start_datetime DESC LIMIT 1`;
      console.info('Query:', query);
      client.query(query, (error, response) => {
        if (error) {
          console.error(error);
        } else {
          const lastTrailDate = response.rows && response.rows[0] && response.rows[0].start_datetime;
          console.info(`Last trail date for hasher #${row.id}: ${lastTrailDate}`);
          if (lastTrailDate) {
            const updateData = [lastTrailDate];
            const updateQuery = `UPDATE hashers SET (last_trail_date) = ($1) WHERE id = ${row.id}`;
            console.info('Query:', updateQuery, updateData);
            client.query(updateQuery, updateData, (error, response) => {
              if (error) {
                console.error(error);
              } else {
                console.info(`Success for hasher #${row.id}!`);
              }
            });
          }
        }
      });
    });
  }
});
