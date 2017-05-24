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
  }
});

route('/about/{secondaryPage}/', { page: 'about' });
route('/about/', { page: 'about' });
route('/admin/{secondaryPage}/', { page: 'admin' });
route('/admin/', { page: 'admin' });
route('/hareline/', { page: 'hareline' });
route('/past-runs/{runNumber}-{date}/', { page: 'past-runs', secondaryPage: 'past-run', runNumber: 0, date: '' });
route('/past-runs/', { page: 'past-runs' });
route('/{page}', { page: defaultPage });


export default AppViewModel;
