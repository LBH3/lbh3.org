import Component from 'can-component';
import DefineMap from 'can-define/map/';
import ajax from 'can-util/dom/ajax/';
import view from './past-run.stache';

export const ViewModel = DefineMap.extend({
  day: 'string',
  month: 'string',
  template: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const templatePromise = this.templatePromise;
      if (templatePromise) {
        templatePromise.then(setValue);
      }
    }
  },
  templatePromise: {
    get: function() {
      const day = this.day;
      const month = this.month;
      const trailNumber = this.trailNumber;
      const year = this.year;
      if (day && month && trailNumber && year) {
        return ajax({
          dataType: 'text/html',
          url: `/html/past-runs/lbh3_${trailNumber}_${year}${month}${day}.html`
        });
      }
    }
  },
  trailNumber: 'number',
  year: 'number'
});

export default Component.extend({
  tag: 'lbh3-past-run',
  ViewModel,
  view
});
