import Component from 'can-component';
import SpecialEvent from '~/models/special-event';
import view from './special.stache';

export default Component.extend({
  tag: 'lbh3-past-runs-special',
  view,
  ViewModel: {
    get specialEventsPromise() {
      return SpecialEvent.getList({
        $limit: 500,
        $sort: {
          startDatetime: -1
        }
      });
    }
  }
});
