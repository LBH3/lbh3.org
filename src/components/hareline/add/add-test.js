import QUnit from 'steal-qunit';
import { ViewModel } from './add';

// ViewModel unit tests
QUnit.module('lbh3/components/hareline/add');

QUnit.test('createTrail resets the form', function(done) {
  var vm = new ViewModel({
    runNumber: 1800,
    startTime: '10:00 a.m.',
    trailDate: '4/15'
  });
  QUnit.equal(vm.runNumber, 1800);
  vm.createTrail().then(function() {
    QUnit.equal(vm.runNumber, 1801);
    done();
  });
});
