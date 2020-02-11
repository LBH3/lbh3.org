import QUnit from 'steal-qunit';
import { getAllRunsQuery, ViewModel } from './erection';

// ViewModel unit tests
QUnit.module('~/components/erection');

QUnit.test('Has title', function(assert) {
  var vm = new ViewModel();
  assert.equal(vm.title, 'Erection | LBH3');
});

QUnit.test('getAllRunsQuery', function(assert) {
  const query = getAllRunsQuery(2020);
  assert.equal(query.startDatetime.$gte.getTime(), new Date(2020, 0, 1).getTime(), '$gte is correct');
  assert.equal(query.startDatetime.$lte.getTime(), new Date(2021, 0, 1).getTime(), '$lte is correct');
});
