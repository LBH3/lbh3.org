import Component from 'can-component';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import Session from '~/models/session';
import moment from 'moment';
import view from './year.stache';

import './year.less';

export const ViewModel = DefineMap.extend({
  eventsByMonth: DefineList,
  eventsPromise: {
    get: function() {
      const currentDate = moment();
      const currentYear = currentDate.year();
      const endDate = (currentYear === this.year) ? currentDate.toDate() : moment().year(this.year).endOf('year').toDate();
      const startDate = moment().year(this.year).startOf('year').toDate();
      return Event.connection.getList({
        $limit: 100,
        $sort: {
          startDatetime: 1
        },
        startDatetime: {
          $gte: startDate,
          $lte: endDate
        }
      }).then((events) => {
        this.eventsByMonth = Event.groupByMonth(events);
        return events;
      });
    }
  },
  get session() {
    return Session.current;
  },
  year: {
    type: 'number'
  }
});

export default Component.extend({
  tag: 'lbh3-year',
  ViewModel,
  view
});
