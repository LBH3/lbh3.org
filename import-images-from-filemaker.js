const { Client } = require('pg');
const fs = require('fs');
const request = require('request');

const contentTypes = {
  'image/gif': 'gif',
  'image/jpeg': 'jpg'
};

const client = new Client({
  database: 'lbh3'
});
client.connect();

/* Read the command’s arguments */
const JSESSIONID = process.argv[2];// Required
if (!JSESSIONID) {
  throw new Error('JSESSIONID required as the first argument to this script');
}
const jar = request.jar();
const cookie = request.cookie(`JSESSIONID=${JSESSIONID}`);
jar.setCookie(cookie, 'http://10.0.1.6');

/* Get a list of all hashers */
client.query(`SELECT external_id,id FROM hashers`, (error, response) => {
  if (error) {
    console.error('Error selecting hashers:', error);
    process.exit();
  } else {
    const hashers = response.rows;
    console.info(`Processing ${hashers.length} hashers`);

    hashers.reduce(function(promise, hasher) {
      return promise.then(function(results) {
        return processHasher(hasher).then(function(result) {
          return results.concat(result)
        }, function(error) {
          console.error(error);
          process.exit();
        });
      }, function(error) {
        console.error(error);
        process.exit();
      });
    }, Promise.resolve([])).then(function(results) {
      console.info(`Processed ${results.length} hashers!`);
      process.exit();
    }, function(error) {
      console.error(error);
      process.exit();
    });
  }
});

function processHasher(hasher) {
  return new Promise(function(resolve, reject) {
    const requestParams = {
      jar,
      url: `http://10.0.1.6/fmi/iwp/data.jpg?-containerfield&-recid=${hasher.external_id}&-field=79(1).9`
    };

    /* Request the image from FileMaker */
    request.head(requestParams, function(error, response, body) {
      if (error) {
        reject(error);
      } else {
        const contentType = response.headers['content-type'];
        if (contentType) {
          const extension = contentTypes[contentType];
          if (extension) {
            const filename = `${uuid()}.${extension}`;

            /* Persist the image to disk */
            request(requestParams).pipe(fs.createWriteStream(`filemaker/images/${filename}`)).on('close', result => {

              /* Update the database with the image’s eventual URL */
              const s3Url = `https://lbh3-headshots.s3.amazonaws.com/${filename}`;
              client.query(`UPDATE hashers SET (headshot_url) = ($1) WHERE external_id = '${hasher.external_id}'`, [s3Url], (error, response) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              });
            });
          } else {
            reject(new Error(`Invalid content type: ${contentType}`));
          }
        } else {
          resolve();
        }
      }
    });
  });
}

function uuid(a) {
  // From https://gist.github.com/jed/982883
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
};
