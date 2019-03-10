import algebra from './algebra';
import behaviors from './behaviors';
import connect from 'can-connect';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import feathersClient from './feathers-client';
import feathersServiceBehavior from 'can-connect-feathers/service';
import marked from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true
});

const SpecialEvent = DefineMap.extend({
  seal: false
}, {
  id: 'number',
  createdAt: 'any',
  updatedAt: 'any',
  descriptionHtml: {
    get: function() {
      return marked(this.descriptionMd || '');
    },
    serialize: false
  },
  descriptionMd: 'string',
  title: {
    get: function() {
      const textContainer = document.createElement('div');
      textContainer.innerHTML = this.descriptionHtml;
      const lines = (textContainer.textContent) ? textContainer.textContent.split('\n') : [];
      return lines.length > 0 ? lines[0].trim() : '';
    },
    serialize: false
  },
  urlId: 'string',
  year: 'number'
});

SpecialEvent.List = DefineList.extend({
  '#': SpecialEvent
});

SpecialEvent.connection = connect([
  feathersServiceBehavior,
  ...behaviors
], {
  feathersService: feathersClient.service('/api/special-events'),
  Map: SpecialEvent,
  List: SpecialEvent.List,
  idProp: 'id',
  name: 'special-event',
  algebra
});

export default SpecialEvent;
