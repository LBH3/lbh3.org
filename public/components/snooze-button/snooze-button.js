import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Event from '~/models/event';
import Session from '~/models/session';
import './snooze-button.less';
import view from './snooze-button.stache';

const getSignedRequest = function(file, event) {
  return new Promise((resolve, reject) => {
    const dateParts = event.startDateParts;
    const trailNumber = event.trailNumber;
    const fileName = encodeURIComponent(`${dateParts.year}/${dateParts.month}-${dateParts.day}` + (trailNumber ? `-${trailNumber}` : '') + '.pdf');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${fileName}&file-type=${file.type}`);
    xhr.onerror = () => {
      reject(xhr);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } else {
          reject(xhr);
        }
      }
    };
    xhr.send();
  });
};

const uploadFile = function(file, signedRequest, url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onerror = () => {
      reject(xhr);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(true);
        } else {
          reject(xhr);
        }
      }
    };
    xhr.send(file);
  });
};

export const ViewModel = DefineMap.extend({
  deleteSnooze() {
    this.event.snoozeUrl = '';
    this.uploadPromise = null;
  },
  event: Event,
  get eventsPromise() {
    return Event.getList({
      $limit: 5,
      $sort: {
        startDatetime: -1
      },
      snoozeUrl: {
        $nin: ['']
      },
      startDatetime: {
        $lt: this.event.startDateAsMoment.format()
      }
    });
  },
  removePromise: Promise,
  get session() {
    return Session.current;
  },
  uploadPromise: Promise
});

export default Component.extend({
  tag: 'lbh3-snooze-button',
  ViewModel,
  view,
  events: {
    'input[type="file"] change': function(input) {
      const file = (input.files && input.files[0]) ? input.files[0] : null;
      if (file) {
        const viewModel = this.viewModel;
        const event = viewModel.event;
        viewModel.uploadPromise = getSignedRequest(file, event).then(response => {
          return uploadFile(file, response.signedRequest, response.url).then(() => {
            event.snoozeUrl = response.url;
          }, error => {
            console.error('Error uploading file:', error);
          });
        }, error => {
          console.error('Error getting signed request:', error);
        });
      }
    }
  }
});
