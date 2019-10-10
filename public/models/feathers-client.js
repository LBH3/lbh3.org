import ajax from 'can-ajax';
import auth from 'feathers-authentication-client';
import feathers from 'feathers/client';
import hooks from 'feathers-hooks';
import loader from '@loader';
import rest from 'feathers-rest/client';

const jQueryReplacement = {
  ajax: function(request) {
    request.beforeSend = (xhr) => {
      if (request.headers) {
        delete request.headers['Content-Type'];// Otherwise this gets set twice
        for (let header in request.headers) {
          xhr.setRequestHeader(header, request.headers[header]);
        }
      }
    };
    request.type = request.method;
    return ajax(request);
  }
};

const feathersClient = feathers()
  .configure(rest(loader.serviceBaseURL).jquery(jQueryReplacement))
  .configure(hooks())
  .configure(auth({
  }));

export default feathersClient;
