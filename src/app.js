import './models/fixtures/';

import DefineMap from 'can-define/map/';
import route from 'can-route';
import 'can-route-pushstate';

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
    type: 'number',
    value: () => {
      return (new Date()).getFullYear();
    }
  }
});

route('/about/{secondaryPage}/', { page: 'about' });
route('/about/', { page: 'about' });
route('/admin/{secondaryPage}/', { page: 'admin' });
route('/admin/', { page: 'admin' });
route('/hareline/', { page: 'hareline' });
route('/past-runs/{year}/', { page: 'past-runs', year: 0});
route('/{page}', { page: defaultPage });


export default AppViewModel;
