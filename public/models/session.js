import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/map';
import feathersClient from './feathers-client';
import feathersSessionBehavior from 'can-connect-feathers/session/session';
import User from './user';

export const Session = DefineMap.extend('Session', {
  userId: 'any',
  // Automatically populate the `user` when a `userId` is set.
  user: {
    Type: User,
    get (lastSetVal, resolve) {
      if (lastSetVal) {
        return lastSetVal;
      }
      if (this.userId) {
        User.get(this.userId).then(resolve);
      }
    }
  },
  exp: {
    identity: true,
    type: 'number'
  },
  aud: 'string',
  iat: 'number',
  iss: 'string',
  sub: 'string'
});

Session.List = DefineList.extend({
  '#': Session
});

Session.connection = connect([
  feathersSessionBehavior,
  ...behaviors
], {
  feathersClient,
  idProp: 'exp',
  Map: Session,
  List: Session.List,
  name: 'session'
});

export default Session;
