const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const through = require('through');
const XMLStream = require('xml-stream');

const databaseURLSplit = process.env.DATABASE_URL.split('/');

const client = new Client({
  database: databaseURLSplit[databaseURLSplit.length - 1]
});
client.connect();

client.query(`SELECT * FROM hashers;`, (error, response) => {
  if (error) {
    console.error(error);
  } else {
    console.info(`${response.rows.length} hashers`);
    const allNewData = response.rows.map(row => {
      console.info(`Mapping data for hasher #${row.id}`);
      const newData = {
        addresses: [],
        emails: [],
        id: row.id,
        phones: []
      };
      if (row.address_country || row.address_city || row.address_state || row.address_street || row.address_zip_code) {
        newData.addresses.push({
          city: row.address_city,
          country: row.address_country,
          privacy: 'bored',
          state: row.address_state,
          street: row.address_street,
          zip: row.address_zip_code
        });
      }
      if (row.address_country_private || row.address_city_private || row.address_state_private || row.address_street_private || row.address_zip_code_private) {
        newData.addresses.push({
          city: row.address_city_private,
          country: row.address_country_private,
          privacy: 'bored',
          state: row.address_state_private,
          street: row.address_street_private,
          zip: row.address_zip_code_private
        });
      }
      if (row.cell_phone) {
        newData.phones.push({
          privacy: 'bored',
          type: 'cell',
          value: row.cell_phone
        });
      }
      if (row.cell_phone_private) {
        newData.phones.push({
          privacy: 'bored',
          type: 'cell',
          value: row.cell_phone_private
        });
      }
      if (row.email_addresses) {
        row.email_addresses.forEach(value => {
          newData.emails.push({
            privacy: 'bored',
            type: 'home',
            value
          });
        });
      }
      if (row.email_addresses_private) {
        row.email_addresses_private.forEach(value => {
          newData.emails.push({
            privacy: 'bored',
            type: 'work',
            value
          });
        });
      }
      if (row.family_name || row.family_name_private) {
        if (row.family_name && row.family_name_private) {
          newData.family_name = row.family_name.length > row.family_name_private.length ? row.family_name : row.family_name_private;
        } else if (row.family_name) {
          newData.family_name = row.family_name;
        } else if (row.family_name_private) {
          newData.family_name = row.family_name_private;
        }
      }
      if (row.fax) {
        newData.phones.push({
          privacy: 'bored',
          type: 'fax',
          value: row.fax
        });
      }
      if (row.given_name || row.given_name_private) {
        if (row.given_name && row.given_name_private) {
          newData.given_name = row.given_name.length > row.given_name_private.length ? row.given_name : row.given_name_private;
        } else if (row.given_name) {
          newData.given_name = row.given_name;
        } else if (row.given_name_private) {
          newData.given_name = row.given_name_private;
        }
      }
      if (row.home_phone) {
        newData.phones.push({
          privacy: 'bored',
          type: 'home',
          value: row.home_phone
        });
      }
      if (row.home_phone_private) {
        newData.phones.push({
          privacy: 'bored',
          type: 'home',
          value: row.home_phone_private
        });
      }
      if (row.work_phone) {
        newData.phones.push({
          privacy: 'bored',
          type: 'work',
          value: row.work_phone
        });
      }
      if (row.work_phone_private) {
        newData.phones.push({
          privacy: 'bored',
          type: 'work',
          value: row.work_phone_private
        });
      }
      return newData;
    });
    console.info(`Updating data for ${allNewData.length} hashers`);
    const promises = allNewData.map(newData => {
      const id = newData.id;
      delete newData.id;
      console.info(`Updating data for hasher #${id}`);

      newData.addresses = JSON.stringify(newData.addresses);
      newData.emails = JSON.stringify(newData.emails);
      newData.phones = JSON.stringify(newData.phones);

      const fields = [];
      for (let key in newData) {
        fields.push(key);
      }
      const insertQuery = fields.join(', ');
      const insertValues = fields.map(function(field, index) {
        return '$' + (index + 1);
      });
      const rowValues = Object.values(newData);
      return new Promise((resolve, reject) => {
        client.query(`UPDATE hashers SET (${insertQuery}) = (${insertValues}) WHERE id=${id}`, rowValues, (error, response) => {
          if (error) {
            console.info(`Tried updating data for hasher #${id}:`, newData);
            console.error('Row update error:', error);
            reject(error);
          } else {
            resolve(response);
          }
        });
      });
    });
    Promise.all(promises).then(() => {
      console.info(`Successfully updated data for ${promises.length} hashers`);
      process.exit(0);
    }, error => {
      console.error(error);
      process.exit(1);
    });
  }
});
