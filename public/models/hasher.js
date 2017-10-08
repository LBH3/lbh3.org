import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import loader from '@loader';
import set from 'can-set';

const Hasher = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any',
  formattedAddress: {
    type: 'string',
    get: function() {
      return [
        this.addressStreet,
        this.addressCity,
        this.addressState,
        this.addressZipCode,
        this.addressCountry
      ].filter(value => value).join(', ');
    }
  },
  formattedPrivateAddress: {
    type: 'string',
    get: function() {
      return [
        this.addressStreetPrivate,
        this.addressCityPrivate,
        this.addressStatePrivate,
        this.addressZipCodePrivate,
        this.addressCountryPrivate
      ].filter(value => value).join(', ');
    }
  }
});

Hasher.List = DefineList.extend({
  '#': Hasher
});

Hasher.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/hashers'),
  Map: Hasher,
  List: Hasher.List,
  name: 'hasher',
  algebra
});

export default Hasher;
