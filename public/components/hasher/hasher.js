import Component from 'can-component';
import DefineMap from 'can-define/map/';
import Hasher from '~/models/hasher';
import Session from '~/models/session';
import './hasher.less';
import view from './hasher.stache';

const uuid = function(a) {
  // From https://gist.github.com/jed/982883
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
};

const getSignedRequest = function(file, hasher) {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop();
    if (!fileExtension) {
      reject('File extension could not be determined by name');
    } else {
      const fileName = encodeURIComponent(`${uuid()}.${fileExtension}`);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/sign-s3?config-bucket-name=headshotsBucketName&file-name=${fileName}&file-type=${file.type}`);
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
    }
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
  hasher: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      this.hasherPromise.then(setValue);
    }
  },
  hasherPromise: {
    get: function() {
      return Hasher.connection.get({
        id: this.id
      });
    }
  },
  headshotPromise: Promise,
  id: 'number',

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  }
});

export default Component.extend({
  tag: 'lbh3-hasher',
  ViewModel,
  view,
  events: {
    'input[type="file"] change': function(input) {
      const file = (input.files && input.files[0]) ? input.files[0] : null;
      if (file) {
        const viewModel = this.viewModel;
        const hasher = viewModel.hasher;
        viewModel.headshotPromise = getSignedRequest(file, hasher).then(response => {
          return uploadFile(file, response.signedRequest, response.url).then(() => {
            hasher.headshotUrl = response.url;
            return hasher.save();
          });
        });
      }
    }
  }
});
