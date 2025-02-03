import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/map';
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
  canEditFutureTrails: doNotSerializeBooleanType,
  canEditHasherInfo: doNotSerializeBooleanType,
  canEditPostTrailInfo: doNotSerializeBooleanType,
  canEditPreTrailInfo: doNotSerializeBooleanType,
  canExportData: doNotSerializeBooleanType,
  canManageBored: doNotSerializeBooleanType,
  canManageUsers: doNotSerializeBooleanType,
  canViewCashReport: doNotSerializeBooleanType,
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
  get hasSharedInfo() {
    const hasher = this.hasher;
    if (hasher) {
      const notPrivate = [
        'birthDayPrivacy',
        'birthMonthPrivacy',
        'birthYearPrivacy',
        'familyNamePrivacy',
        'givenNamePrivacy',
        'headshotPrivacy',
        'motherHashPrivacy',
        'whoMadeYouCumPrivacy'
      ].filter(field => {
        return hasher[field] === 'directory';
      });
      if (notPrivate.length > 0) {
        return true;
      } else {
        const multiNotPrivate = [
          'addresses',
          'emails',
          'phones',
        ].filter(field => {
          const internalPrivate = hasher[field].filter(value => {
            return value.privacy === 'directory';
          });
          return internalPrivate.length > 0;
        });
        return multiNotPrivate.length > 0;
      }
    }
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
