import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import constructor from 'can-connect/constructor/';
import constructorCallbacksOnce from 'can-connect/constructor/callbacks-once/';
import constructorStore from 'can-connect/constructor/store/';
import dataCallbacks from 'can-connect/data/callbacks/';
import dataParse from 'can-connect/data/parse/';
import realtime from 'can-connect/real-time/';

const behaviors = [
  dataParse,
  constructor,
  constructorStore,
  constructorCallbacksOnce,
  canMap,
  canRef,
  dataCallbacks,
  realtime
];

export default behaviors;
