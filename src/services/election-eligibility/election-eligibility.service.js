// Initializes the `election-eligibility` service on path `/api/election-eligibility`
const hooks = require('./election-eligibility.hooks');

function hasherIsEligibleWithRuns(runs) {
  return runs.length >= 1; 
}

module.exports = function () {
  const app = this;

  app.use('/api/election-eligibility', {
    find(params) {
      const $limit = 500;
      const electionId = params.query.electionId;
      const electionService = app.service('api/elections');

      // Get the election
      return electionService.get(electionId).then(election => {

        // Get all the trail numbers for that year
        const eventService = app.service('api/events');
        return eventService.find({
          query: {
            $limit,
            startDatetime: {
              $gte: new Date(election.year, 0),
              $lte: new Date(election.year + 1, 0)
            }
          },
          user: params.user
        }).then(events => {

          // Get the attendance for each of those runs
          const eventsHasherService = app.service('api/events-hashers');
          const promises = events.data.map(event => {
            return eventsHasherService.find({
              query: {
                $limit,
                trailNumber: event.trailNumber
              },
              user: params.user
            });
          });
          return Promise.all(promises).then(allResults => {

            // Transform the attendance for each run to each hasher
            const hashersToRuns = new Map();
            allResults.forEach(result => {
              result.data.forEach(eventHasher => {
                if (hashersToRuns.get(eventHasher.hasherId) === undefined) {
                  hashersToRuns.set(eventHasher.hasherId, []);
                }
                hashersToRuns.get(eventHasher.hasherId).push(eventHasher);
              });
            });

            // If querying just for a single hasher, return just that
            if (params.query.hasherId) {
              const runs = hashersToRuns.get(Number(params.query.hasherId)) || [];
              const lastRun = runs[runs.length - 1] || {};
              return [{
                eligible: hasherIsEligibleWithRuns(runs),
                familyName: lastRun.familyName,
                givenName: lastRun.givenName,
                hasherId: params.query.hasherId,
                hashName: lastRun.hashName,
                runs
              }];
            }

            // Transform the mapping to an array of hashers with runs
            const endResult = [];
            hashersToRuns.forEach((runs, hasherId) => {
              runs.sort((a, b) => {
                return a.trailNumber - b.trailNumber;
              });
              const lastRun = runs[runs.length - 1];
              endResult.push({
                eligible: hasherIsEligibleWithRuns(runs),
                familyName: lastRun.familyName,
                givenName: lastRun.givenName,
                hasherId,
                hashName: lastRun.hashName,
                runs
              });
            });
            return endResult;
          });
        });
      });
    }
  });

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/election-eligibility');

  service.hooks(hooks);
};