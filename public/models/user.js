import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import Hasher from './hasher';

var User = DefineMap.extend('User', {
  seal: false
}, {
  id: 'any',
  canAddHashers: {
    type: 'boolean',
    serialize: false
  },
  canAddPhotos: {
    type: 'boolean',
    serialize: false
  },
  canAddSnoozes: {
    type: 'boolean',
    serialize: false
  },
  canAddTrails: {
    type: 'boolean',
    serialize: false
  },
  canAdministerElections: {
    type: 'boolean',
    serialize: false
  },
  canEditFutureSpecialEvents: {
    type: 'boolean',
    serialize: false
  },
  canEditHasherInfo: {
    type: 'boolean',
    serialize: false
  },
  canEditPostTrailInfo: {
    type: 'boolean',
    serialize: false
  },
  canEditPreTrailInfo: {
    type: 'boolean',
    serialize: false
  },
  canExportData: {
    type: 'boolean',
    serialize: false
  },
  canManageUsers: {
    type: 'boolean',
    serialize: false
  },
  canViewDirectoryInfo: {
    type: 'boolean',
    serialize: false
  },
  canViewHashersEmailList: {
    type: 'boolean',
    serialize: false
  },
  canViewOldData: {
    type: 'boolean',
    serialize: false
  },
  canViewRunAttendance: {
    type: 'boolean',
    serialize: false
  },
  displayName: {
    get: function() {
      const profile = this.profile || {};
      return profile.displayName || '';
    },
    serialize: false
  },
  email: {
    get: function() {
      const profile = this.profile || {};
      return (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null;
    },
    serialize: false
  },
  familyName: {
    get: function() {
      const profile = this.profile || {};
      const name = profile.name || {};
      return name.familyName || '';
    },
    serialize: false
  },
  givenName: {
    get: function() {
      const profile = this.profile || {};
      const name = profile.name || {};
      return name.givenName || '';
    },
    serialize: false
  },
  hasher: {
    get: function(lastSetValue, resolve) {
      if (lastSetValue) {
        return lastSetValue;
      }
      const hasherPromise = this.hasherPromise;
      if (hasherPromise) {
        hasherPromise.then(resolve);
      }
    },
    serialize: false
  },
  hasherId: 'number',
  hasherPromise: {
    get: function() {
      const id = this.hasherId;
      if (id) {
        return Hasher.connection.get({
          id
        });
      }
    },
    serialize: false
  },
  profile: {
    get: function() {
      return this.facebookProfile || this.googleProfile;
    },
    serialize: false
  },
  requestedName: 'string'
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
