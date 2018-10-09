/* eslint-disable no-console, no-unreachable */
const { authenticate } = require('@feathersjs/authentication').express;
const aws = require('aws-sdk');
const cookieParser = require('cookie-parser');
const env = process.env.NODE_ENV || 'development';
const eol = require('os').EOL;
const fs = require('fs');
const json2csv = require('json2csv');
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
      if (hasher.emailAddresses && hasher.emailAddresses.length) {
        hasher.emailAddresses.forEach(emailAddress => {
          vcardLines.push(`EMAIL:${emailAddress}`);
        });
      }
      if (hasher.emailAddressesPrivate && hasher.emailAddressesPrivate.length) {
        hasher.emailAddressesPrivate.forEach(emailAddress => {
          vcardLines.push(`EMAIL:${emailAddress}`);
        });
      }
      if (hasher.cellPhone) {
        vcardLines.push(`TEL;TYPE=CELL,VOICE:${hasher.cellPhone}`);
      }
      if (hasher.cellPhonePrivate) {
        vcardLines.push(`TEL;TYPE=CELL,VOICE:${hasher.cellPhonePrivate}`);
      }
      if (hasher.homePhone) {
        vcardLines.push(`TEL;TYPE=HOME,VOICE:${hasher.homePhone}`);
      }
      if (hasher.homePhonePrivate) {
        vcardLines.push(`TEL;TYPE=HOME,VOICE:${hasher.homePhonePrivate}`);
      }
      if (hasher.workPhone) {
        vcardLines.push(`TEL;TYPE=WORK,VOICE:${hasher.workPhone}`);
      }
      if (hasher.workPhonePrivate) {
        vcardLines.push(`TEL;TYPE=WORK,VOICE:${hasher.workPhonePrivate}`);
      }
      if (hasher.addressStreet) {
        vcardLines.push([
          'ADR',
          ':',
          '',
          hasher.addressStreet,
          hasher.addressCity,
          hasher.addressState,
          hasher.addressZipCode,
          hasher.addressCountry
        ].join(';'));
      }
      if (hasher.addressStreetPrivate) {
        vcardLines.push([
          'ADR',
          ':',
          '',
          hasher.addressStreetPrivate,
          hasher.addressCityPrivate,
          hasher.addressStatePrivate,
          hasher.addressZipCodePrivate,
          hasher.addressCountryPrivate
        ].join(';'));
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

  app.get('/events/jesus-cuervo-1800-trail/', function(req, res) {
    res.redirect('/events/2017/jesus-cuervo/');
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
  }));
};
