import './models/fixtures/positions';
import '~/components/no-ssr/';

import DefineMap from 'can-define/map/';
import loader from '@loader';
import route from 'can-route';
import 'can-route-pushstate';

const currentYear = (new Date()).getFullYear();
const defaultPage = 'home';

const AppViewModel = DefineMap.extend({
  day: 'string',
  id: 'number',
  month: 'string',
  page: {
    type: 'string',
    value: defaultPage
  },
  secondaryPage: 'string',
  skip: 'number',
  title: {
    value: 'Long Beach Hash House Harriers',
    serialize: false
  },
  trailNumber: 'number',
  year: 'number'
});

route('/about/mismanagement/{year}/', { page: 'about', secondaryPage: 'mismanagement', year: 0});
route('/about/{secondaryPage}/', { page: 'about' });
route('/about/', { page: 'about' });
route('/admin/{secondaryPage}/', { page: 'admin' });
route('/admin/', { page: 'admin' });
route('/events/', { page: 'events' });
route('/events/founders/', { page: 'events', secondaryPage: 'founders'});
route('/events/jesus-cuervo-1800-trail/', { page: 'events', secondaryPage: 'jesus-cuervo-1800-trail'});
route('/events/memorial-service/', { page: 'events', secondaryPage: 'memorial-service'});
route('/events/{year}/{month}/{day}/trail-{trailNumber}/{secondaryPage}/', { page: 'events', year: 0, month: '', day: '', trailNumber: 0, secondaryPage: ''});
route('/events/{year}/{month}/{day}/trail-{trailNumber}/', { page: 'events', year: 0, month: '', day: '', trailNumber: 0});
route('/events/{year}/', { page: 'events', year: 0});
route('/hareline/{year}/{month}/{day}/trail-{trailNumber}/{secondaryPage}/', { page: 'hareline', year: 0, month: '', day: '', trailNumber: 0, secondaryPage: ''});
route('/hareline/{secondaryPage}/', { page: 'hareline' });
route('/hareline/', { page: 'hareline' });
route('/hashers/{id}/{secondaryPage}/', { page: 'hashers', id: 0, secondaryPage: ''});
route('/hashers/{id}/', { page: 'hashers', id: 0 });
route('/hashers/', { page: 'hashers' });
route('/{page}', { page: defaultPage });

export default AppViewModel;
