import behaviors from './behaviors';
import canReflect from 'can-reflect';
import connect from 'can-connect';
import feathersClient from './feathers-client';
import feathersQueryLogic from 'feathers-query-logic';
import feathersServiceBehavior from 'can-connect-feathers/service';
import QueryLogic from 'can-query-logic';

const allBehaviors = [
  feathersServiceBehavior,
  ...behaviors
];

export default function(url, options) {
  options.feathersService = feathersClient.service(url);
  options.queryLogic = new QueryLogic(options.Map, feathersQueryLogic);

  // Workaround until can-connect-feathers is updated
  const identity = canReflect.getSchema(options.queryLogic).identity;
  options.idProp = identity[0];

  return connect(allBehaviors, options);
};
