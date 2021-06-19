import QUnit from 'qunitjs';
import { ViewModel } from './add-event';

// ViewModel unit tests
QUnit.module('~/components/hareline/add-event');

QUnit.test('Has title', function(assert) {
  var vm = new ViewModel();
  assert.equal(vm.title, 'Add Event | Hareline | LBH3');
});
