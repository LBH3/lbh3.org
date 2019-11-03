import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import constructor from 'can-connect/constructor/';
import constructorCallbacksOnce from 'can-connect/constructor/callbacks-once/';
import constructorStore from 'can-connect/constructor/store/';
import dataCallbacks from 'can-connect/data/callbacks/';
import dataParse from 'can-connect/data/parse/';

const behaviors = [
  dataParse,
  constructor,
  constructorStore,
  constructorCallbacksOnce,
  canMap,
  canRef,
  dataCallbacks
];

export default behaviors;
