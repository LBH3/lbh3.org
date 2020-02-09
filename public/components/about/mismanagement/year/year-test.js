import BoredYear from '~/models/bored-year';
import Hasher from '~/models/hasher';
import QUnit from 'steal-qunit';
import { ViewModel } from './year';

// ViewModel unit tests
QUnit.module('lbh3/components/about/mismanagement/year');

QUnit.test('addendum returns “starting in” text', function(assert) {
  const hasher = new Hasher({
    endDate: '2020-02-16',
    startDate: '2019-04-30'
  });
  const year = new BoredYear({
    endDate: '2020-02-16',
    startDate: '2019-02-17'
  });
  const addendum = new ViewModel().addendum(year, hasher);
  assert.equal(addendum, 'starting in April');
});

QUnit.test('addendum returns “until” text', function(assert) {
  const hasher = new Hasher({
    endDate: '2020-03-01',
    startDate: '2019-02-17'
  });
  const year = new BoredYear({
    endDate: '2020-02-16',
    startDate: '2019-02-17'
  });
  const addendum = new ViewModel().addendum(year, hasher);
  assert.equal(addendum, 'until March');
});
