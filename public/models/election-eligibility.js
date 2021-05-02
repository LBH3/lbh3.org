import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/map';
import EventsHashers from './events-hashers';
import feathersModel from './feathers-model';
import { sortByHashOrJustName } from '~/components/run/sort-hashers';

const ElectionEligibility = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  familyName: 'string',
  givenName: 'string',
  hasherId: 'number',
  hashName: 'string',
  hashOrJustName: {
    get: function() {
      const hashName = this.hashName;
      if (hashName) {
        return hashName;
      }
      return `Just ${this.givenName} ${this.familyName}`.trim();
    },
    serialize: false
  },
  runs: EventsHashers.List
});

ElectionEligibility.List = DefineList.extend({
  '#': ElectionEligibility,
  get eligible() {
    return this.filter(hasher => {
      return hasher.eligible === true;
    }).sort(sortByHashOrJustName);
  },
  get notEligible() {
    return this.filter(hasher => {
      return hasher.eligible !== true;
    }).sort(sortByHashOrJustName);
  }
});

ElectionEligibility.connection = feathersModel('/api/election-eligibility', {
  Map: ElectionEligibility,
  List: ElectionEligibility.List,
  name: 'election-eligibility'
});

export default ElectionEligibility;
