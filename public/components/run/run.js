import "./run.less";

import Component from "can-component";
import Event from "~/models/event";
import EventsHashers from "~/models/events-hashers";
import EventsRoutes from "~/models/events-routes";
import Session from "~/models/session";
import moment from "moment-timezone";
import view from "./run.stache";

export default Component.extend({
  tag: "lbh3-run",
  view,
  ViewModel: {
    get canViewRunAttendance() {
      const user = this.session && this.session.user;
      if (user) {
        if (user.canViewRunAttendance) {
          return true;
        }
        return this.didAttendThisRun;
      }
      return false;
    },
    day: "string",
    get description() {
      return `Details about LBH3 run #${this.trailNumber}.`;
    },
    get didAttendThisRun() {
      const hashers = this.hashers;
      const user = this.session && this.session.user;
      if (hashers && user) {
        return hashers.some({
          hasherId: user.hasherId,
        });
      }
      return false;
    },
    event: {
      get(lastSetValue, resolve) {
        this.eventPromise.then((events) => {
          resolve(events[0]);
        });
      },
    },
    get eventPromise() {
      return Event.getList(this.eventQuery);
    },
    get eventQuery() {
      let params;
      const trailNumber = this.trailNumber;

      if (trailNumber) {
        params = {
          trailNumber,
        };
      } else {
        const startOfToday = moment()
          .tz("America/Los_Angeles")
          .startOf("day")
          .toDate();
        params = {
          $sort: {
            startDatetime: 1,
          },
          startDatetime: {
            $gte: startOfToday,
          },
        };
      }

      return params;
    },
    hashers: {
      get: function (lastValue, setValue) {
        const hashersPromise = this.hashersPromise;
        if (hashersPromise) {
          hashersPromise.then(setValue);
        }
      },
    },
    get hashersPromise() {
      if (
        this.event &&
        this.event.hasStartedOrIsCloseToStarting &&
        this.trailNumber
      ) {
        return EventsHashers.getList({
          $limit: 500,
          trailNumber: this.trailNumber,
        });
      }
    },
    month: "string",
    get ogTitle() {
      return `Run #${this.trailNumber}`;
    },
    routes: {
      get: function (lastValue, setValue) {
        const routesPromise = this.routesPromise;
        if (routesPromise) {
          routesPromise.then(setValue);
        }
      },
    },
    get routesPromise() {
      const event = this.event;
      if (event && event.hasProbablyEnded && this.trailNumber) {
        return EventsRoutes.getList({
          $limit: 500,
          trailNumber: this.trailNumber,
        });
      }
    },
    secondaryPage: "string",
    get session() {
      return Session.current;
    },
    get showAttendancePrompt() {
      return !this.hashersPromise || !this.hashers || this.hashers.length === 0;
    },
    get showDonation() {
      const event = this.event;
      if (event) {
        return !event.hasProbablyEnded && !event.specialEventId;
      }
      return false;
    },
    get title() {
      return `${this.ogTitle} | LBH3`;
    },
    trailNumber: "number",
    visibleRoutes: {
      get() {
        const routes = this.routes;
        return routes ? routes.slice() : undefined;
      }
    },
    get visibleSegments() {
      const visibleRoutes = this.visibleRoutes;
      if (visibleRoutes) {
        return visibleRoutes.reduce((accumulator, route) => {
          route.segments.forEach(segment => {
            accumulator.push(segment);
          });
          return accumulator;
        }, []);
      }
    },
    year: "number",
  }
});
