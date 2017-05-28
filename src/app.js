import './models/fixtures/';

import DefineMap from 'can-define/map/';
import route from 'can-route';
import 'can-route-pushstate';

const currentYear = (new Date()).getFullYear();
const defaultPage = 'home';

const AppViewModel = DefineMap.extend({
  day: 'string',
  month: 'string',
  page: {
    type: 'string',
    value: defaultPage
  },
  secondaryPage: 'string',
  title: {
    value: 'Long Beach Hash House Harriers',
    serialize: false
  },
  trailNumber: 'number',
  year: 'number'
});

route('/about/{secondaryPage}/', { page: 'about' });
route('/about/', { page: 'about' });
route('/admin/{secondaryPage}/', { page: 'admin' });
route('/admin/', { page: 'admin' });
route('/events/{year}/{month}/{day}/trail-{trailNumber}/', { page: 'events', year: 0, month: 0, day: 0, trailNumber: 0});
route('/events/{year}/', { page: 'events', year: 0});
route('/events/', { page: 'events' });
route('/hareline/', { page: 'hareline' });
route('/{page}', { page: defaultPage });

export default AppViewModel;
