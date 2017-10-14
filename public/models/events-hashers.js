import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import set from 'can-set';
import loader from '@loader';

const EventsHashers = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  paymentNotesAndType: {
    get: function() {
      const paymentNotes = this.paymentNotes;
      const paymentType = this.paymentType;
      if (paymentNotes && paymentType) {
        return `${paymentNotes} (${paymentType})`;
      } else if (paymentNotes) {
        return paymentNotes;
      } else if (paymentType) {
        return paymentType;
      }
      return '';
    },
    serialize: false
  }
});

EventsHashers.List = DefineList.extend({
  '#': EventsHashers
});

EventsHashers.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/events-hashers'),
  Map: EventsHashers,
  List: EventsHashers.List,
  name: 'events-hashers',
  algebra
});

export default EventsHashers;
