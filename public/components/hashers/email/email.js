import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './email.less';
import view from './email.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: ''
  },
  emailGroups: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.hashersPromise.then(hashers => {
        const grouped = Hasher.groupByEmailing(hashers);
        setValue(grouped);
      });
    }
  },
  hashersPromise: {
    get: function() {
      return Hasher.getList({
        $or: [
          {emailing: '1'},
          {emailing: '2'},
          {emailing: '3'},
          {emailing: '4'},
          {emailing: '5'},
          {emailing: '5a'},
          {emailing: 'A'},
          {emailing: 'B'},
          {emailing: 'C'},
          {emailing: 'c'},
          {emailing: 'R'},
          {emailing: 'y'},
          {emailing: 'Yes'}
        ],
        $limit: 500,
        $sort: {
          emailing: 1
        }
      });
    }
  },
  get ogTitle() {
    return 'Email List';
  },
  get session() {
    return Session.current;
  },
  get title() {
    return `${this.ogTitle} | Hashers | LBH3`;
  }
});

export default Component.extend({
  tag: 'lbh3-hashers-email',
  ViewModel,
  view
});
