import Component from 'can-component';
import DefineMap from 'can-define/map/';
import EventsHashers from '~/models/events-hashers';
import Hasher from '~/models/hasher';
import Patch from '~/models/patch';
import Session from '~/models/session';
import './hasher.less';
import route from 'can-route';
import view from './hasher.stache';

const uuid = function(a) {
  // From https://gist.github.com/jed/982883
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
};

const deleteHeadshotAtUrl = function(url) {
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

const $limit = 100;

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
  get currentPage() {
    const runs = this.runs;
    const skip = runs.skip;
    return (skip / $limit) + 1;
  },
  get pages() {
    const runs = this.runs;
    const pages = [];

    if (!runs) {
      return pages;
    }

    const total = runs.total;
    const numberOfPages = Math.round(total / $limit);
    for (let i = 1; i <= numberOfPages; i++) {
      pages.push(i);
    }
    return pages;
  },
  patches: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const patchesPromise = this.patchesPromise;
      if (patchesPromise) {
        patchesPromise.then(setValue);
      }
    }
  },
  patchesPromise: {
    get: function() {
      const hasherId = this.hasher.id;
      if (hasherId) {
        return Patch.connection.getList({
          hasherId,
          $limit: 500,
          $sort: {
            trailNumber: -1
          }
        });
      }
    }
  },
  routeForHasher: function(hasher) {
    const routeParams = {
      id: this.hasher.id,
      page: 'hashers'
    };
    return route.url(routeParams);
  },
  routeForPage: function(page) {
    const routeParams = {
      id: this.hasher.id,
      page: 'hashers',
      skip: $limit * (page - 1)
    };
    return route.url(routeParams);
  },
  runs: {
    get: function(lastValue, setValue) {
      if (lastValue) {
        return lastValue;
      }
      const runsPromise = this.runsPromise;
      if (runsPromise) {
        runsPromise.then(setValue);
      }
    }
  },
  runsPromise: {
    get: function() {
      const hasherId = this.hasher.id;
      if (hasherId) {
        return EventsHashers.connection.getList({
          hasherId,
          $limit,
          $skip: this.skip,
          $sort: {
            trailNumber: -1
          }
        });
      }
    }
  },

  /**
   * Session.current is provided by the can-connect-feathers session behavior.
   * It will automatically populate when `new Session().save()` occurs in the app
   * or on refresh after login.
   */
  get session() {
    return Session.current;
  },

  skip: {
    type: 'number',
    value: 0
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
            const previousHeadshotUrl = hasher.headshotUrl;
            hasher.headshotUrl = response.url;
            return hasher.save().then(savedHasher => {
              if (previousHeadshotUrl) {
                deleteHeadshotAtUrl(previousHeadshotUrl);
              }
              return savedHasher;
            });
          });
        });
      }
    }
  }
});
