import F from 'funcunit';
import QUnit from 'steal-qunit';

import 'lbh3/models/test';

import 'lbh3/components/about/about-test';
import 'lbh3/components/about/mismanagement/mismanagement-test';
import 'lbh3/components/admin/admin-test';
import 'lbh3/components/footer/footer-test';
import 'lbh3/components/hareline/guidelines/guidelines-test';
import 'lbh3/components/hareline/hareline-test';
import 'lbh3/components/header/header-test';
import 'lbh3/components/home/home-test';
import 'lbh3/components/jesus-cuervo/jesus-cuervo-test';
import 'lbh3/components/nav/nav-test';
import 'lbh3/components/past-run/past-run-test';
import 'lbh3/components/past-runs/past-runs-test';
import 'lbh3/components/year/year-test';

F.attach(QUnit);

QUnit.module('lbh3 functional smoke test', {
  beforeEach() {
    F.open('./development.html');
  }
});

QUnit.test('lbh3 main page shows up', function() {
  F('title').text('Long Beach Hash House Harriers', 'Title is set');
});
