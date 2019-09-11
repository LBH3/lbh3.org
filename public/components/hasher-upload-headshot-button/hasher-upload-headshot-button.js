import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './hasher-upload-headshot-button.less';
import { emailingOptions, Hasher } from '~/models/hasher';
import { paymentRates } from '~/models/events-hashers';
import view from './hasher-upload-headshot-button.stache';

function deleteHeadshotAtUrl(url) {
  const urlSplit = url.split('/');
  const fileName = (urlSplit.length > 0) ? urlSplit.pop() : null;
  console.info('About to delete filename:', fileName);
  if (fileName) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/s3?file-name=${fileName}`);
    xhr.onerror = () => {
      console.error('Delete failed with XMLHttpRequest:', xhr);
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.info('Delete succeeded with XMLHttpRequest:', xhr);
        } else {
          console.error('Delete failed with XMLHttpRequest:', xhr);
        }
      }
    };
    xhr.send();
  }
};

function getSignedRequest(file) {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop();
    if (!fileExtension) {
      reject('File extension could not be determined by name');
    } else {
      const fileName = encodeURIComponent(`${uuid()}.${fileExtension}`);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/sign-s3?acl=public-read&config-bucket-name=headshotsBucketName&file-name=${fileName}&file-type=${file.type}`);
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

function uploadFile(file, signedRequest, url) {
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

function uuid(a) {
  // From https://gist.github.com/jed/982883
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
};

export const ViewModel = DefineMap.extend({
  hasher: Hasher,
  headshotPromise: Promise,
  previousHeadshotUrls: {
    default() {
      return [];
    }
  },
  session: 'any'
});

export default Component.extend({
  tag: 'lbh3-hasher-upload-headshot-button',
  ViewModel,
  view,
  events: {
    '{hasher} updated': function() {
      this.viewModel.previousHeadshotUrls.forEach(deleteHeadshotAtUrl);
    },
    'input[type="file"] change': function(input) {
      const file = (input.files && input.files[0]) ? input.files[0] : null;
      if (file) {
        const viewModel = this.viewModel;
        viewModel.headshotPromise = getSignedRequest(file).then(response => {
          return uploadFile(file, response.signedRequest, response.url).then(() => {
            const hasher = viewModel.hasher;
            if (hasher.headshotUrl) {
              viewModel.previousHeadshotUrls.push(hasher.headshotUrl);
            }
            hasher.headshotUrl = response.url;
          });
        });
      }
    }
  }
});
