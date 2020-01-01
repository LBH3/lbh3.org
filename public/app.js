import '~/components/no-ssr/';

import DefineMap from 'can-define/map/';
import Honeybadger from 'honeybadger-js';
import loader from '@loader';
import route from 'can-route';
import RoutePushstate from 'can-route-pushstate';

const defaultPage = 'home';
const environment = loader.getEnv();

Honeybadger.configure({
  apiKey: 'ff6891e2',
  disabled: environment === 'development',
  environment
});

const AppViewModel = DefineMap.extend({
  day: 'string',
  description: {
    default: '',
    serialize: false
  },
  id: 'number',
  month: 'string',
  noHeadshot: {
    default: false,
    serialize(noHeadshot) {
      return noHeadshot || undefined;
    }
  },
  nodeEnv: {
    get() {
      return this.env && this.env.NODE_ENV || 'development';
    },
    serialize: false
  },
  ogTitle: {
    default: '',
    serialize: false
  },
  page: {
    default: defaultPage,
  },
  role: {
    default: '',
    serialize(role) {
      return role || undefined;
    }
  },
  search: {
    default: '',
    serialize(search) {
      return search || undefined;
    }
  },
  secondaryPage: 'string',
  skip: {
    default: 0,
    serialize(skip) {
      return skip || undefined;
    }
  },
  showHashit: {
    default: false,
    serialize(search) {
      return search || undefined;
    }
  },
  showNotes: {
    default: false,
    serialize(search) {
      return search || undefined;
    }
  },
  showOnOn: {
    default: false,
    serialize(search) {
      return search || undefined;
    }
  },
  showScribe: {
    default: false,
    serialize(search) {
      return search || undefined;
    }
  },
  sort: {
    default: '',
    serialize(sort) {
      return sort || undefined;
    }
  },
  title: {
    default: 'LBH3',
    serialize: false
  },
  trailNumber: 'number',
  urlId: 'string',
  year: 'number'
});

route.urlData = new RoutePushstate();

route.register('/about/mismanagement/{year}/', { page: 'about', secondaryPage: 'mismanagement', year: 0});
route.register('/about/{secondaryPage}/', { page: 'about' });
route.register('/about/', { page: 'about' });
route.register('/erections/{urlId}/{secondaryPage}/', { page: 'erections', urlId: '', secondaryPage: ''});
route.register('/erections/{urlId}/', { page: 'erections', urlId: '' });
route.register('/erections/', { page: 'erections' });
route.register('/events/', { page: 'events' });
route.register('/events/founders/', { page: 'events', secondaryPage: 'founders'});
route.register('/events/{year}/{month}/{day}/trail-{trailNumber}/{secondaryPage}/', { page: 'events', year: 0, month: '', day: '', trailNumber: 0, secondaryPage: ''});
route.register('/events/{year}/{month}/{day}/trail-{trailNumber}/', { page: 'events', year: 0, month: '', day: '', trailNumber: 0});
route.register('/events/{year}/{urlId}/{secondaryPage}/', { page: 'events', secondaryPage: '', urlId: '', year: 0 });
route.register('/events/{year}/{urlId}/', { page: 'events', secondaryPage: '', urlId: '', year: 0});
route.register('/events/{year}/{urlId}', { page: 'events', secondaryPage: '', urlId: '', year: 0});
route.register('/events/{year}/', { page: 'events', secondaryPage: '', year: 0});
route.register('/hareline/{year}/{month}/{day}/trail-{trailNumber}/{secondaryPage}/', { page: 'hareline', year: 0, month: '', day: '', trailNumber: 0, secondaryPage: ''});
route.register('/hareline/{secondaryPage}/', { page: 'hareline' });
route.register('/hareline/', { page: 'hareline' });
route.register('/hashers/add/', { page: 'hashers', secondaryPage: 'add'});
route.register('/hashers/attendance-records/', { page: 'hashers', secondaryPage: 'attendance-records'});
route.register('/hashers/early-warning/', { page: 'hashers', secondaryPage: 'early-warning'});
route.register('/hashers/email/', { page: 'hashers', secondaryPage: 'email'});
route.register('/hashers/{id}/{secondaryPage}/', { page: 'hashers', id: 0, secondaryPage: ''});
route.register('/hashers/{id}/', { page: 'hashers', id: 0 });
route.register('/hashers/', { page: 'hashers', secondaryPage: '' });
route.register('/special-events/', { page: 'special-events' });
route.register('/users/{id}/{secondaryPage}/', { page: 'users', id: 0, secondaryPage: '' });
route.register('/users/', { page: 'users' });
route.register('/{page}', { page: defaultPage });

export default AppViewModel;
