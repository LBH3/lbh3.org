import canMap from 'can-connect/can/map/map';
import canRef from 'can-connect/can/ref/ref';
import constructor from 'can-connect/constructor/constructor';
import constructorCallbacksOnce from 'can-connect/constructor/callbacks-once/callbacks-once';
import constructorStore from 'can-connect/constructor/store/store';
import dataCallbacks from 'can-connect/data/callbacks/callbacks';
import dataParse from 'can-connect/data/parse/parse';
import realtime from 'can-connect/real-time/real-time';

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
