import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './header.less';
import platform from 'steal-platform';
import view from './header.stache';

export const ViewModel = DefineMap.extend({
  id: 'number',
  get hashersPromise() {
    const now = new Date();
    return Hasher.getList({
      $limit: 500,
      deathDate: {
        $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      },
      $sort: {
        deathDate: -1
      }
    });
  },
  hashersText: {
    get: function(lastValue, setValue) {
      const hashersPromise = this.hashersPromise;
      if (hashersPromise) {
        hashersPromise.then(hashers => {
          if (hashers.length === 1) {
            setValue(`In memory of ${hashers[0].hashOrJustName}`);
          } else if (hashers.length === 2) {
            setValue(`In memory of ${hashers[0].hashOrJustName} and ${hashers[1].hashOrJustName}`);
          } else if (hashers.length > 2) {
            const hasherNames = hashers.map(hasher => {
              return hashOrJustName;
            });
            const lastName = hasherNames.pop();
            setValue(`In memory of ${hasherNames.join(', ')}, and ${lastName}`);
          }
        });
      }
    }
  },
  page: 'string',
  platform: {
    default: () => {
      return platform;
    }
  },
  secondaryPage: 'string',
  get session() {
    return Session.current;
  }
});

export default Component.extend({
  tag: 'lbh3-header',
  ViewModel,
  view
});
