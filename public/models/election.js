import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import feathersModel from './feathers-model';
import Hasher from './hasher';
import marked from 'marked';
import moment from 'moment-timezone';

export const randomize = (list) => {
  const array = [...list];
  let currentIndex = list.length;
  let randomIndex;
  let temporaryValue;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

const timeZone = 'America/Los_Angeles';

const Race = DefineMap.extend({
  seal: false
}, {
  hasherOptions: {
    get() {
      return new DefineList(randomize(this.options));
    }
  },
  get showWriteInOption() {
    return this.maxSelection > this.options.length;
  }
});
Race.List = DefineList.extend({
  '#': Race
});

const SchemaChild = DefineMap.extend({
  seal: false
}, {
  races: Race.List,
  title: 'string'
});

const Schema = DefineMap.extend({
  seal: false
}, {
  awards: SchemaChild,
  positions: SchemaChild
});

export const Election = DefineMap.extend({
  seal: false
}, {
  id: {
    identity: true,
    type: 'number'
  },
  advertisementHtml: {
    get: function() {
      const rendered = marked(this.advertisementMd || '');
      return rendered.replace('<p>', '').replace('</p>', '').trim();
    },
    serialize: false
  },
  advertisementMd: 'string',
  descriptionHtml: {
    get: function() {
      return marked(this.descriptionMd || '');
    },
    serialize: false
  },
  endDateAsMoment: {
    get: function() {
      return moment(this.endDatetime).tz(timeZone);
    },
    serialize: false
  },
  endedNoticeHtml: {
    get: function() {
      return marked(this.endedNoticeMd || '');
    },
    serialize: false
  },
  hasEnded: {
    get: function() {
      return this.endDateAsMoment.isBefore();
    },
    serialize: false
  },
  schema: Schema,
  startDateAsMoment: {
    get: function() {
      return moment(this.startDatetime).tz(timeZone);
    },
    serialize: false
  }
});

Election.List = DefineList.extend({
  '#': Election
});

Election.connection = feathersModel('/api/elections', {
  Map: Election,
  List: Election.List,
  name: 'election'
});

export default Election;
