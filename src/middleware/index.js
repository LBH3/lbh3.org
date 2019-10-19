/* eslint-disable no-console, no-unreachable */
const { authenticate } = require('@feathersjs/authentication').express;
const aws = require('aws-sdk');
const cookieParser = require('cookie-parser');
const env = process.env.NODE_ENV || 'development';
const eol = require('os').EOL;
const fs = require('fs');
const json2csv = require('json2csv');
const request = require('request');
const sharp = require('sharp');
const ssr = require('done-ssr-middleware');

module.exports = function (app) {

  app.use(function(req, res, next) {
    // res.header('Referrer-Policy', 'same-origin');
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
  });

  if (env !== 'development') {
    app.get('*', function(req, res, next) {
      const httpHost = req.get('Host');
      const needsSSLRedirect = req.headers['x-forwarded-proto'] !== 'https' && !httpHost.includes('localhost');
      const needsWWWRedirect = httpHost === 'lbh3.org';
      if (needsSSLRedirect) {
        res.redirect(`https://${httpHost}${req.url}`);
      } else if (needsWWWRedirect) {
        res.redirect(`https://www.${httpHost}${req.url}`);
      } else {
        next();
      }
    });
  }

  app.get('/api/csv', cookieParser(), authenticate('jwt'), function(req, res) {
    const $limit = 500;
    const query = req.query;

    const serviceName = `api/${query.service}`;
    const service = app.service(serviceName);

    const errorHandler = error => {
      console.error(`Error creating CSV for service ${service}:`, error);
      res.status(500);
      res.write(JSON.stringify(error));
      res.end();
    };

    const processResults = (results, options) => {
      const parser = new json2csv.Parser(options);
      const csv = parser.parse(results.data);
      res.write(csv + eol);
    };

    let result = service.find({ query: {$limit}, user: req.user });

    result.then(initialResults => {
      res.setHeader('Content-Disposition', `attachment;filename=${query.service}.csv`);
      res.setHeader('Content-Type', 'text/csv');

      processResults(initialResults);

      const total = initialResults.total;
      const numberOfPages = Math.ceil(total / $limit);

      for (let i = 1; i < numberOfPages; i++) {
        result = result.then(() => {
          return new Promise((resolve, reject) => {
            service.find({
              query: {
                $limit,
                $skip: $limit * i
              },
              user: req.user
            }).then(results => {
              processResults(results, {header: false});
              resolve();
            }, reject);
          });
        }, errorHandler);
      }

      result.then(() => {
        res.end();
      }, errorHandler);
    }, errorHandler);
  });

  app.get('/api/hashers/:hasherId/vcard.vcf', cookieParser(), authenticate('jwt'), function(req, res) {
    const params = req.params;

    const hasherId = params.hasherId;
    app.service('api/hashers').get(hasherId, {user: req.user}).then(hasher => {
      res.setHeader('Content-Type', 'text/vcard');
      const vcardLines = [
        'BEGIN:VCARD',
        'VERSION:3.0'
      ];
      if (hasher.familyName || hasher.givenName) {
        vcardLines.push(`N:${hasher.familyName};${hasher.givenName};;;`);
        vcardLines.push(`FN:${hasher.givenName} ${hasher.familyName}`);
      }
      if (hasher.hashName) {
        vcardLines.push(`NICKNAME:${hasher.hashName}`);
      }
      if (hasher.birthDay && hasher.birthMonth) {
        let birthDay = hasher.birthDay.toString();
        birthDay = birthDay.length === 1 ? `0${birthDay}` : birthDay;
        let birthMonth = hasher.birthMonth.toString();
        birthMonth = birthMonth.length === 1 ? `0${birthMonth}` : birthMonth;
        const birthYear = hasher.birthYear || '--';
        vcardLines.push(`BDAY:${birthYear}${birthMonth}${birthDay}`);
      }
      if (hasher.headshotUrl) {
        vcardLines.push(`PHOTO:${hasher.headshotUrl}`);
      }
      if (hasher.emails && hasher.emails.length > 0) {
        hasher.emails.forEach(email => {
          vcardLines.push(`EMAIL;type=INTERNET;type=${email.type.toUpperCase()}:${email.value}`);
        });
      }
      if (hasher.phones && hasher.phones.length > 0) {
        hasher.phones.forEach(phone => {
          vcardLines.push(`TEL;TYPE=${phone.type.toUpperCase()},VOICE:${phone.value}`);
        });
      }
      if (hasher.addresses && hasher.addresses.length > 0) {
        hasher.addresses.forEach(address => {
          vcardLines.push([
            'ADR',
            ':',
            '',
            `${address.street} ${address.subpremise == null ? '' : address.subpremise}`.trim(),
            address.city,
            address.state,
            address.zip,
            address.country
          ].join(';'));
        });
      }
      if (hasher.updatedAt) {
        vcardLines.push(`REV:${hasher.updatedAt.toISOString()}`);
      }
      vcardLines.push('END:VCARD');
      res.write(vcardLines.join('\n'));
      res.end();
    }, error => {
      console.error(`Error fetching vCard for hasher #${hasherId}:`, error);
      res.status(500);
      res.write(JSON.stringify(error));
      res.end();
    });
  });

  app.get('/image', (req, res) => {
    const params = req.query;
    const height = params.height ? Number(params.height) : null;
    const width = params.width ? Number(params.width) : null;
    console.time(`Fetch ${params.url} for sizing ${width}, ${height}`);
    request({
      encoding: null,
      method: 'GET',
      url: params.url
    }, (error, response, body) => {
      console.timeEnd(`Fetch ${params.url} for sizing ${width}, ${height}`);
      if (response && response.statusCode === 200) {
        console.time(`Resize ${params.url} for sizing ${width}, ${height}`);
        sharp(body)
          .resize(width, height, {
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toFormat('jpeg')
          .toBuffer()
          .then(data => {
            console.timeEnd(`Resize ${params.url} for sizing ${width}, ${height}`);
            res.setHeader('Cache-Control', 'public,max-age=31536000,immutable');
            if (response.headers.etag) {
              res.setHeader('ETag', response.headers.etag);
            }
            if (response.headers['last-modified']) {
              res.setHeader('Last-Modified', response.headers['last-modified']);
            }
            res.send(data);
            res.end();
          })
          .catch(error => {
            console.error(`Error running sharp for image at URL ${params.url}:`, error);
            res.send(body);
            res.end();
          });
      } else {
        if (error) {
          console.error(`Error fetching image at URL ${params.url}:`, error);
        }
        res.status(response && response.statusCode || 500);
        res.send(body);
        res.end();
      }
    });
  });

  app.get('/pastruns/runs/lbh3_:trailNumber\\_:date.php', function(req, res) {
    const params = req.params;

    const date = params.date;
    const day = date.slice(6, 8);
    const month = date.slice(4, 6);
    const trailNumber = params.trailNumber;
    const year = date.slice(0, 4);

    res.redirect(`/events/${year}/${month}/${day}/trail-${trailNumber}/`);
  });

  const redirectConfig = JSON.parse(fs.readFileSync('./redirects.json', 'utf8'));
  for (let from in redirectConfig) {
    (function(to) {
      app.get(from, function(req, res) {
        res.redirect(301, to);
      });
    })(redirectConfig[from]);
  }

  app.delete('/s3', (req, res) => {
    const awsConfig = app.get('aws');
    const bucketName = awsConfig.headshotsBucketName;
    const fileName = req.query['file-name'];
    const s3 = new aws.S3();
    const s3Params = {
      Bucket: bucketName,
      Key: fileName
    };

    s3.deleteObject(s3Params, (error, data) => {
      if (error) {
        console.error('Error deleting file:', error);
        res.status(500);
        res.write(JSON.stringify(error));
      } else {
        res.write(JSON.stringify(data));
      }
      res.end();
    });
  });

  app.get('/sign-s3', (req, res) => {
    const awsConfig = app.get('aws');
    const getBucketName = req.query['config-bucket-name'] || 'snoozeBucketName';
    const bucketName = awsConfig[getBucketName];
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3 = new aws.S3();
    const s3Params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: req.query['acl'] || 'private'
    };

    s3.getSignedUrl('putObject', s3Params, (error, data) => {
      if (error) {
        console.error('Error getting signed URL:', error);
        res.status(500);
        res.write(JSON.stringify(error));
      } else {
        const returnData = {
          signedRequest: data,
          url: `https://${bucketName}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
      }
      res.end();
    });
  });

  app.get('/snoozes/:year/:fileName', (req, res) => {
    const awsConfig = app.get('aws');
    const params = req.params;

    const bucketName = awsConfig['snoozeBucketName'];
    const fileName = `${params.year}/${params.fileName}`;
    const s3 = new aws.S3();
    const s3Params = {
      Bucket: bucketName,
      Key: fileName
    };
    res.attachment(fileName);
    s3.getObject(s3Params).createReadStream().pipe(res);
  });

  app.use(ssr({
    config: `${__dirname}/../../public/package.json!npm`,
    main: 'lbh3/index.stache!done-autorender'
  }, {
    strategy: 'seo'
  }));
};
