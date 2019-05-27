import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/';
import feathersModel from './feathers-model';
import Hasher from './hasher';

const doNotSerializeBooleanType = {
  serialize: false,
  type: 'boolean'
};

var User = DefineMap.extend('User', {
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  canAddHashers: doNotSerializeBooleanType,
  canAddPhotos: doNotSerializeBooleanType,
  canAddSnoozes: doNotSerializeBooleanType,
  canAddTrails: doNotSerializeBooleanType,
  canAdministerElections: doNotSerializeBooleanType,
  canEditFutureSpecialEvents: doNotSerializeBooleanType,
  canEditHasherInfo: doNotSerializeBooleanType,
  canEditPostTrailInfo: doNotSerializeBooleanType,
  canEditPreTrailInfo: doNotSerializeBooleanType,
  canExportData: doNotSerializeBooleanType,
  canManageUsers: doNotSerializeBooleanType,
  canViewDirectoryInfo: doNotSerializeBooleanType,
  canViewHashersEmailList: doNotSerializeBooleanType,
  canViewOldData: doNotSerializeBooleanType,
  canViewRunAttendance: doNotSerializeBooleanType,
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

User.connection = feathersModel('/api/users', {
  Map: User,
  List: User.List,
  name: 'users'
});

export default User;
