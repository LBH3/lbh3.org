import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import loader from '@loader';
import set from 'can-set';

const Place = DefineMap.extend({
  seal: false
}, {
  id: 'string'
});

Place.List = DefineList.extend({
  '#': Place
});

Place.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/places'),
  Map: Place,
  List: Place.List,
  name: 'place',
  algebra
});

Place.fromGoogle = function(googlePlace) {
  const place = {
    addressComponents: googlePlace.address_components,
    formattedAddress: googlePlace.formatted_address,
    formattedPhoneNumber: googlePlace.formatted_phone_number,
    geometryLocation: {
      coordinates: [
        googlePlace.geometry.location.lat(),
        googlePlace.geometry.location.lng()
      ],
      type: 'Point'
    },
    geometryViewport: {
      coordinates: [[
        [
          googlePlace.geometry.viewport.f.f,
          googlePlace.geometry.viewport.b.f
        ],
        [
          googlePlace.geometry.viewport.f.b,
          googlePlace.geometry.viewport.b.b
        ]
      ]],
      type: 'Polygon'
    },
    icon: googlePlace.icon,
    id: googlePlace.id,
    internationalPhoneNumber: googlePlace.international_phone_number,
    name: googlePlace.name,
    placeId: googlePlace.place_id,
    reference: googlePlace.reference,
    scope: googlePlace.scope,
    types: googlePlace.types,
    url: googlePlace.url,
    vicinity: googlePlace.vicinity,
    website: googlePlace.website
  };
  return new Place(place);
};

export default Place;
