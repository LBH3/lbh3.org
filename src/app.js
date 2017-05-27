import './models/fixtures/';

import DefineMap from 'can-define/map/';
import route from 'can-route';
import 'can-route-pushstate';

const currentYear = (new Date()).getFullYear();
const defaultPage = 'home';

const AppViewModel = DefineMap.extend({
  page: {
    type: 'string',
    value: defaultPage
  },
  secondaryPage: 'string',
  title: {
    value: 'Long Beach Hash House Harriers',
    serialize: false
  },
  year: {
    type: 'number'
  }
});

route('/about/{secondaryPage}', { page: 'about' });
route('/admin/{secondaryPage}', { page: 'admin' });
route('/hareline', { page: 'hareline' });
route('/events/{year}', { page: 'events', year: currentYear});
route('/{page}', { page: defaultPage });


export default AppViewModel;
