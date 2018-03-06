import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import User from '~/models/user';
import './users.less';
import view from './users.stache';

export const ViewModel = DefineMap.extend({
  secondaryPage: 'string',
  get session() {
    return Session.current;
  },
  users: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.usersPromise.then(setValue);
    }
  },
  usersPromise: {
    get: function() {
      return User.connection.getList({
        $limit: 50,
        $sort: {
          updatedAt: -1
        }
      });
    }
  }
});

export default Component.extend({
  tag: 'lbh3-users',
  ViewModel,
  view
});
