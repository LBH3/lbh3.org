import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import Session from '~/models/session';
import './photos-button.less';
import view from './photos-button.stache';

export const ViewModel = DefineMap.extend({
  event: 'any',
  faSize: 'string',
  promptForUrl: function() {
    const event = this.event;
    const eventName = (event.nameMd) ? `“${event.nameMd}”` : `the trail on ${event.startDateWithYearString}`;
    const question = `What’s the URL to photos for ${eventName}?`;
    const answer = (prompt(question) || '').trim();
    const https = 'https://';
    if (answer) {
      if (answer.substr(0, https.length) === https) {
        event.photosUrl = answer;
        this.savePromise = event.save();
      } else {
        alert(`Sorry, ${answer} is not a valid photo URL. It should start with ${https}`);
      }
    }
  },
  savePromise: Promise,
  get session() {
    return Session.current;
  },
  showEdit: {
    default: false,
    type: 'boolean'
  }
});

export default Component.extend({
  tag: 'lbh3-photos-button',
  ViewModel,
  view
});
