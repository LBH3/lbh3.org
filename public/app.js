import '~/components/no-ssr/';

import DefineMap from 'can-define/map/';
import Honeybadger from 'honeybadger-js';
import loader from '@loader';
import route from 'can-route';
import RoutePushstate from 'can-route-pushstate';
import Session from '~/models/session';

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
  searchMissing: {
    serialize(searchMissing) {
      return searchMissing || undefined;
    }
  },
  secondaryPage: 'string',
  get session() {
    return Session.current;
  },
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
  get whichEventsPage() {
    if (this.secondaryPage === 'attendance') {
      return 'attendance';
    } else if (this.secondaryPage === 'edit') {
      return 'edit';
    } else if (this.secondaryPage === 'search') {
      return 'past-runs';
    } else if (this.trailNumber) {
      return 'run';
    } else if (this.urlId) {
      return 'special-event';
    } else {
      return 'past-runs';
    }
  },
  view: {
    serialize: function(view) {
      return view === 'list' ? undefined : view;
    }
  },
  year: {
    serialize: function(year) {
      return this.page === 'events' && this.secondaryPage === 'search' ? undefined : year;
    }
  }
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
route.register('/events/search/', { page: 'events', secondaryPage: 'search'});
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
route.register('/hashers/in-memoriam/', { page: 'hashers', secondaryPage: 'in-memoriam'});
route.register('/hashers/{id}/{secondaryPage}/', { page: 'hashers', id: 0, secondaryPage: ''});
route.register('/hashers/{id}/', { page: 'hashers', id: 0 });
route.register('/hashers/', { page: 'hashers', secondaryPage: '' });
route.register('/special-events/', { page: 'special-events' });
route.register('/users/{id}/{secondaryPage}/', { page: 'users', id: 0, secondaryPage: '' });
route.register('/users/', { page: 'users' });
route.register('/{page}', { page: defaultPage });

export default AppViewModel;
