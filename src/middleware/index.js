/* eslint-disable no-console */
const aws = require('aws-sdk');
const fs = require('fs');
const ssr = require('done-ssr-middleware');

module.exports = function () {
  const app = this;

  app.use(function(req, res, next) {
    // res.header('Referrer-Policy', 'same-origin');
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
  });

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
      ACL: 'public-read'
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

  app.use(ssr({
    config: `${__dirname}/../../public/package.json!npm`,
    main: 'lbh3/index.stache!done-autorender',
    liveReload: true,
    auth: {
      cookie: 'feathers-jwt',
      domains: [
        'localhost'
      ]
    }
  }));
};
