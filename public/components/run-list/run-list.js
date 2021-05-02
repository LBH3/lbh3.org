import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import Session from '~/models/session';
import './run-list.less';
import view from './run-list.stache';

export const ViewModel = DefineMap.extend({
  events: {},
  get session() {
    return Session.current;
  },
  showFutureTools: 'boolean',
  showHares: {
    default: true
  },
  showHashit: 'boolean',
  get showingAdditionalInfo() {
    return this.showHashit || this.showNotes || this.showOnOn || this.showScribe;
  },
  showNotes: 'boolean',
  showOnOn: 'boolean',
  showScribe: 'boolean',
  showSnooze: {
    default: true
  },
  showTrailNumber: {
    default: true
  },
  showYear: 'boolean'
});

export default Component.extend({
  tag: 'lbh3-run-list',
  ViewModel,
  view
});
