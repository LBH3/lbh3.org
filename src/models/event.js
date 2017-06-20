import DefineList from 'can-define/list/';
import DefineMap from 'can-define/map/';
import loader from '@loader';
import set from 'can-set';
import superMap from 'can-connect/can/super-map/';

const Event = DefineMap.extend({
  seal: false
}, {
  id: 'any',
  runNumber: 'number',
  startTime: 'string',
  trailDate: 'string'
});

const algebra = new set.Algebra(
  set.props.id('id')
);

Event.List = DefineList.extend({
  '#': Event
});

Event.connection = superMap({
  url: loader.serviceBaseURL + '/api/events',
  Map: Event,
  List: Event.List,
  name: 'event',
  algebra
});

export default Event;
