/*eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
// Pushes every future trail to the Google Calendar in GOOGLE_CALENDAR_ID,
// using the same sync hook that runs when a trail is saved on the site.
// Use it after pointing GOOGLE_CALENDAR_ID at a new (empty) calendar.
//
// Dry run (default; reads the database, writes nothing):
//   node scripts/sync-future-trails-to-google-calendar.js
// Sync for real:
//   node scripts/sync-future-trails-to-google-calendar.js --apply
//
// Safe to re-run: the hook updates an existing event at the trail's start
// time instead of creating a duplicate. Stops at the first error.

const app = require('../src/app');
const eventsHooks = require('../src/services/events/events.hooks');

const apply = process.argv.includes('--apply');
const syncWithGoogleCalendar = eventsHooks.after.update[0];

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!syncWithGoogleCalendar || syncWithGoogleCalendar.name !== 'syncWithGoogleCalendar') {
  fail('Could not find syncWithGoogleCalendar in the events after-update hooks.');
}
if (!process.env.GOOGLE_CALENDAR_ID) {
  fail('GOOGLE_CALENDAR_ID is not set.');
}
if (apply && !process.env.GOOGLE_OAUTH_PRIVATE_KEY) {
  fail('GOOGLE_OAUTH_PRIVATE_KEY is not set.');
}

const run = async function () {
  const trails = await app.service('api/events').find({
    paginate: false,
    query: {
      $sort: { startDatetime: 1 },
      startDatetime: { $gte: new Date().toISOString() },
    },
  });

  console.info(`Calendar: ${process.env.GOOGLE_CALENDAR_ID}`);
  console.info(`${trails.length} future trail(s)${apply ? '' : ' (dry run; pass --apply to sync)'}`);

  for (const trail of trails) {
    // The hook expects request-shaped data, where the start is an ISO string
    const data = Object.assign({}, trail, {
      startDatetime: new Date(trail.startDatetime).toISOString(),
    });
    const label = `#${data.trailNumber} ${data.startDatetime}`;
    if (!apply) {
      console.info(`Would sync ${label}`);
      continue;
    }
    await syncWithGoogleCalendar({ app, data });
    console.info(`Synced ${label}`);
    // Stay well under the Calendar API's per-user rate limit
    await new Promise(resolve => setTimeout(resolve, 250));
  }
};

run().then(() => {
  process.exit(0);
}, (error) => {
  console.error(error);
  process.exit(1);
});
