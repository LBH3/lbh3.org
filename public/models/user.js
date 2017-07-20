import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';

var User = DefineMap.extend('User', {
  seal: false
}, {
  id: 'any',
  canAddTrails: {
    get: function() {
      return this.email === 'chasen@chasenlehara.com';
    },
    serialize: false
  },
  canEditTrails: {
    get: function() {
      const emails = [
        'chasen@chasenlehara.com',
        'santoschris92@gmail.com',
        'vic.lbh3@gmail.com'
      ];
      return emails.indexOf(this.email) > -1;
    },
    serialize: false
  },
  email: {
    get: function() {
      const profile = this.googleProfile || {};
      return (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;
    },
    serialize: false
  }
});

User.List = DefineList.extend({
  '#': User
});

User.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  Map: User,
  List: User.List,
  feathersService: feathersClient.service('/api/users'),
  name: 'users',
  algebra
});

User.algebra = algebra;

export default User;
