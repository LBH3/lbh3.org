const fs = require('fs');
const server = require('done-serve');

const app = server({
  path: __dirname,
  configure: function(app) {
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

app.listen(process.env.PORT || 8080);
