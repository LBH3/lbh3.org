const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const through = require('through');
const XMLStream = require('xml-stream');

const client = new Client({
  database: 'lbh3'
});
client.connect();
const patchesFromString = require('./migrate-patches-parser')(client);

client.query(`SELECT hare_patches_md,patches_md,trail_number FROM events WHERE (hare_patches_md <> '' OR patches_md <> '') AND trail_number > 0 ORDER BY trail_number ASC;`, (error, response) => {
  if (error) {
    debugger;
    console.error(error);
  } else {
    console.info(`${response.rows.length} events with patches`);
    const mappedPromises = response.rows.map(row => {
      console.info(`Parsing patches from trail ${row.trail_number}:`, row.hare_patches_md, row.patches_md);
      if (row.hare_patches_md && row.patches_md) {
        return [
          patchesFromString(row.hare_patches_md, row.trail_number, 'hare'),
          patchesFromString(row.patches_md, row.trail_number, 'run')
        ];
      } else if (row.hare_patches_md) {
        return [patchesFromString(row.hare_patches_md, row.trail_number, 'hare')];
      } else if (row.patches_md) {
        return [patchesFromString(row.patches_md, row.trail_number, 'run')];
      }
    });
    console.info(`Reducing ${mappedPromises.length} promises`);
    const reducedPromises = mappedPromises.reduce((previous, current) => {
      return previous.concat(current);
    }, []);
    console.info(`Getting results from ${reducedPromises.length} promises`);
    const promises = Promise.all(reducedPromises).then(results => {
      results.reduce((previous, current) => {
        return previous.concat(current);
      }, []).forEach(result => {
        if (result) {
          const insertValues = Object.values(result);
          console.info('Inserting result:', insertValues);
          client.query(`INSERT INTO patches (hasher_id,number,trail_number,type) VALUES ($1,$2,$3,$4)`, insertValues, (error, response) => {
            if (error) {
              console.info('Result:', result);
              debugger;
              console.error('Row insert error:', error);
            } else {
              console.info('Inserted values:', insertValues);
            }
          });
        }
      })
    }, error => {
      debugger;
      console.error(error);
    });
  }
});
