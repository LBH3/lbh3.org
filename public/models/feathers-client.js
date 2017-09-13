import '~/polyfills';
import auth from 'feathers-authentication-client';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import jQuery from 'jquery';
import loader from '@loader';
import rest from 'feathers-rest/client';

const feathersClient = feathers()
  .configure(rest(loader.serviceBaseURL).jquery(jQuery))
  .configure(hooks())
  .configure(auth({
  }));

export default feathersClient;
