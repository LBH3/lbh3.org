import Component from 'can-component';
import DefineMap from 'can-define/map/map';
import Session from '~/models/session';
import './scribing.less';
import view from './scribing.stache';

export const ViewModel = DefineMap.extend({
	description: {
		default: 'Learn how to write a great scribe writeup for LBH3.'
	},
	get ogTitle() {
		return 'Scribing Guidelines';
	},
	get title() {
		return `${this.ogTitle} | LBH3`;
	},

	get session() {
	  return Session.current;
	}
});

export default Component.extend({
	tag: 'lbh3-hareline-scribing',
	ViewModel,
	view
});
