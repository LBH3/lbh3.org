import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './email.less';
import view from './email.stache';

const $limit = 500;

const getHashers = ($skip) => {
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
    $limit,
    $skip,
    $sort: {
      emailing: 1
    }
  });
};

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
      return new Promise((resolve, reject) => {
        let hashers = [];
        let result = getHashers(0);

        result.then(initialResults => {

          // Add the first set to the array
          hashers = [...hashers, ...initialResults];

          const total = initialResults.total;
          const numberOfPages = Math.ceil(total / $limit);

          for (let i = 1; i < numberOfPages; i++) {
            result = result.then(() => {
              return getHashers($limit * i).then(results => {
                hashers = [...hashers, ...results];
              }, reject);
            }, reject);
          }

          result.then(() => {
            resolve(hashers);
          }, reject);
        }, reject);
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
    return `${this.ogTitle} | Directory | LBH3`;
  }
});

export default Component.extend({
  tag: 'lbh3-hashers-email',
  ViewModel,
  view
});
