import auth from 'feathers-authentication-client';
import feathers from 'feathers/client';
import fetch from 'unfetch';
import hooks from 'feathers-hooks';
import loader from '@loader';
import rest from 'feathers-rest/client';

const feathersClient = feathers()
  .configure(rest(loader.serviceBaseURL).fetch(fetch.bind(window)))
  .configure(hooks())
  .configure(auth({
    storage: window.localStorage
  }));

export default feathersClient;
