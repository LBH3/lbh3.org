import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import EventsHashers from './events-hashers';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import { sortByHashOrJustName } from '~/components/run/sort-hashers';

const ElectionEligibility = DefineMap.extend({
  seal: false
}, {
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

ElectionEligibility.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/election-eligibility'),
  Map: ElectionEligibility,
  List: ElectionEligibility.List,
  name: 'election-eligibility',
  algebra
});

export default ElectionEligibility;
