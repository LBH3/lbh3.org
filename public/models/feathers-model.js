import behaviors from './behaviors';
import canReflect from 'can-reflect';
import connect from 'can-connect';
import feathersClient from './feathers-client';
import feathersQueryLogic from 'feathers-query-logic';
import feathersServiceBehavior from 'can-connect-feathers/service';
import QueryLogic from 'can-query-logic';

export const allBehaviors = [
  feathersServiceBehavior,
  ...behaviors
];

export function customFeathersModel(url, options, customBehaviors) {
  options.feathersService = feathersClient.service(url);
  options.queryLogic = new QueryLogic(options.Map, feathersQueryLogic);

  // Workaround until can-connect-feathers is updated
  const identity = canReflect.getSchema(options.queryLogic).identity;
  options.idProp = identity[0];

  return connect(customBehaviors, options);

}

export default function(url, options) {
  return customFeathersModel(url, options, allBehaviors);
};
