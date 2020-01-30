import Component from 'can-component';
import Event from '~/models/event';
import Session from '~/models/session';
import SpecialEvent from '~/models/special-event';
import Year from '~/models/year';
import moment from 'moment';
import platform from 'steal-platform';
import route from 'can-route';
import view from './past-runs.stache';

import './past-runs.less';
import '~/components/year/';

const currentYear = (new Date()).getFullYear();

export default Component.extend({
  tag: 'lbh3-past-runs',
  view,
  ViewModel: {
    allEvents: {
      get(lastSetValue, resolve) {
        const allEventsPromise = this.allEventsPromise;
        allEventsPromise.then(values => {
          resolve([
            ...values[0],
            ...values[1]
          ]);
        });
      }
    },
    get allEventsPromise() {
      return Promise.all([
        this.eventsPromise,
        this.specialEventsPromise
      ]);
    },
    get description() {
      return `Archive of LBH3’s runs in ${this.year}.`;
    },
    get eventQuery() {
      const currentDate = moment();
      const currentYear = currentDate.year();
      const endDate = (currentYear === this.year) ? currentDate.toDate() : moment().year(this.year).endOf('year').toDate();
      const startDate = moment().year(this.year).startOf('year').toDate();
      return {
        $limit: 100,
        startDatetime: {
          $gte: startDate,
          $lte: endDate
        }
      };
    },
    get eventsPromise() {
      return Event.getList(this.eventQuery);
    },
    get ogTitle() {
      return 'Past Runs';
    },
    platform: {
      default: () => {
        return platform;
      }
    },
    routeForYear: function(year) {
      const routeParams = {
        page: 'events',
        secondaryPage: '',
        year
      };
      return route.url(routeParams);
    },
    get session() {
      return Session.current;
    },
    showHashit: {
      default: false,
      type: 'boolean'
    },
    showNotes: {
      default: false,
      type: 'boolean'
    },
    showOnOn: {
      default: false,
      type: 'boolean'
    },
    showScribe: {
      default: false,
      type: 'boolean'
    },
    get specialEventsPromise() {
      return SpecialEvent.getList(this.eventQuery);
    },
    get title() {
      return `${this.ogTitle} | LBH3`;
    },
    view: 'string',
    year: {
      type: 'number',
      get: function(year) {
        if (year) {
          return year;
        }
        const years = this.years;
        if (years) {
          const filtered = years.filter({id: currentYear});
          return filtered.length === 0 ? currentYear - 1 : currentYear;
        }
      }
    },
    years: {
      get: function(lastValue, setValue) {
        if (lastValue) {
          return lastValue;
        }
        this.yearsPromise.then(setValue);
      }
    },
    yearsPromise: {
      default: () => {
        return Year.getList({
          $sort: {
            id: 1
          }
        });
      }
    }
  }
});
