const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const server = require('done-serve');

const app = server({
  path: __dirname,
  configure: function(app) {
    app.use(function(req, res, next) {
      res.header('Referrer-Policy', 'same-origin');
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
  }
});

if (process.argv.indexOf('--develop') > -1) {
  const liveReload = path.join('node_modules', '.bin', 'steal-tools live-reload');
  const childProcess = exec(liveReload, {
    cwd: process.cwd()
  });
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
}

app.listen(process.env.PORT || 8080);
