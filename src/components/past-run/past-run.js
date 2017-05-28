import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './past-run.less';
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
      this.templatePromise.then(setValue);
    }
  },
  templatePromise: {
    get: function() {
      return ajax({
        dataType: 'text/html',
        url: `/src/html/past-runs/lbh3_${this.trailNumber}_${this.year}${this.month}${this.day}.html`
      });
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
