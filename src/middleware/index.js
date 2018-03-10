/* eslint-disable no-console, no-unreachable */
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

  app.get('/api/hashers/:hasherId/vcard.vcf', function(req, res) {
    res.status(401);
    res.end();
    return;

    const params = req.params;

    const hasherId = params.hasherId;
    const query = `SELECT * FROM hashers WHERE id=${hasherId}`;
    const sequelize = app.get('sequelizeClient');
    sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    }).then(hashers => {
      const hasher = hashers[0];
      res.setHeader('Content-Type', 'text/vcard');
      const vcardLines = [
        'BEGIN:VCARD',
        'VERSION:3.0'
      ];
      if (hasher.family_name || hasher.given_name) {
        vcardLines.push(`N:${hasher.family_name};${hasher.given_name};;;`);
        vcardLines.push(`FN:${hasher.given_name} ${hasher.family_name}`);
      }
      if (hasher.hash_name) {
        vcardLines.push(`NICKNAME:${hasher.hash_name}`);
      }
      if (hasher.birth_day && hasher.birth_month) {
        let birthDay = hasher.birth_day.toString();
        birthDay = birthDay.length === 1 ? `0${birthDay}` : birthDay;
        let birthMonth = hasher.birth_month.toString();
        birthMonth = birthMonth.length === 1 ? `0${birthMonth}` : birthMonth;
        const birthYear = hasher.birth_year || '--';
        vcardLines.push(`BDAY:${birthYear}${birthMonth}${birthDay}`);
      }
      if (hasher.headshot_url) {
        vcardLines.push(`PHOTO:${hasher.headshot_url}`);
      }
      if (hasher.email_addresses && hasher.email_addresses.length) {
        hasher.email_addresses.forEach(emailAddress => {
          vcardLines.push(`EMAIL:${emailAddress}`);
        });
      }
      if (hasher.email_addresses_private && hasher.email_addresses_private.length) {
        hasher.email_addresses_private.forEach(emailAddress => {
          vcardLines.push(`EMAIL:${emailAddress}`);
        });
      }
      if (hasher.cell_phone) {
        vcardLines.push(`TEL;TYPE=CELL,VOICE:${hasher.cell_phone}`);
      }
      if (hasher.cell_phone_private) {
        vcardLines.push(`TEL;TYPE=CELL,VOICE:${hasher.cell_phone_private}`);
      }
      if (hasher.home_phone) {
        vcardLines.push(`TEL;TYPE=HOME,VOICE:${hasher.home_phone}`);
      }
      if (hasher.home_phone_private) {
        vcardLines.push(`TEL;TYPE=HOME,VOICE:${hasher.home_phone_private}`);
      }
      if (hasher.work_phone) {
        vcardLines.push(`TEL;TYPE=WORK,VOICE:${hasher.work_phone}`);
      }
      if (hasher.work_phone_private) {
        vcardLines.push(`TEL;TYPE=WORK,VOICE:${hasher.work_phone_private}`);
      }
      if (hasher.address_street) {
        vcardLines.push([
          'ADR',
          ':',
          '',
          hasher.address_street,
          hasher.address_city,
          hasher.address_state,
          hasher.address_zip_code,
          hasher.address_country
        ].join(';'));
      }
      if (hasher.address_street_private) {
        vcardLines.push([
          'ADR',
          ':',
          '',
          hasher.address_street_private,
          hasher.address_city_private,
          hasher.address_state_private,
          hasher.address_zip_code_private,
          hasher.address_country_private
        ].join(';'));
      }
      vcardLines.push(`REV:${hasher.updated_at.toISOString()}`);
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
    main: 'lbh3/index.stache!done-autorender'
  }));
};
