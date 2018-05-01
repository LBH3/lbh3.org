import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './memorial-service.stache';

export const ViewModel = DefineMap.extend({
  description: {
    default: 'Learn more about our upcuming LBH3 memorial service.'
  },
  title: {
    default: 'Hash Memorial Service | LBH3'
  }
});

export default Component.extend({
  tag: 'lbh3-memorial-service',
  ViewModel,
  view
});
