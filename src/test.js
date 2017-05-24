import F from 'funcunit';
import QUnit from 'steal-qunit';

import 'lbh3/models/test';

F.attach(QUnit);

QUnit.module('lbh3 functional smoke test', {
  beforeEach() {
    F.open('./development.html');
  }
});

QUnit.test('lbh3 main page shows up', function() {
  F('title').text('Long Beach Hash House Harriers', 'Title is set');
});
