import Component from 'can-component';
import stache from 'can-stache';
import view from './main.stache';
import ViewModel from './app.js';

export default Component.extend({
  tag: 'lbh3-main',
  view,
  ViewModel
});

document.body.appendChild(stache('<lbh3-main></lbh3-main>')())