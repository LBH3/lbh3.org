import F from 'funcunit';
import QUnit from 'steal-qunit';

import 'lbh3/models/test';

import 'lbh3/components/about/about-test';
import 'lbh3/components/about/mismanagement/mismanagement-test';
import 'lbh3/components/about/mismanagement/year/year-test';
import 'lbh3/components/about/privacy/privacy-test';
import 'lbh3/components/erection/erection-test';
import 'lbh3/components/erection/ballots/ballots-test';
import 'lbh3/components/erection/edit/edit-test';
import 'lbh3/components/erection/eligibility/eligibility-test';
import 'lbh3/components/erection/nav/nav-test';
import 'lbh3/components/erection/results/results-test';
import 'lbh3/components/erections/erections-test';
import 'lbh3/components/footer/footer-test';
import 'lbh3/components/founders-2018/founders-2018-test';
import 'lbh3/components/hareline/add/add-test';
import 'lbh3/components/hareline/guidelines/guidelines-test';
import 'lbh3/components/hareline/hareline-test';
import 'lbh3/components/hasher/edit/edit-test';
import 'lbh3/components/hasher/hasher-test';
import 'lbh3/components/hasher-autocomplete/hasher-autocomplete-test';
import 'lbh3/components/hasher-edit-form/hasher-edit-form-test';
import 'lbh3/components/hashers/add/add-test';
import 'lbh3/components/hashers/attendance-records/attendance-records-test';
import 'lbh3/components/hashers/early-warning/early-warning-test';
import 'lbh3/components/hashers/email/email-test';
import 'lbh3/components/hashers/hashers-test';
import 'lbh3/components/header/header-test';
import 'lbh3/components/home/home-test';
import 'lbh3/components/memorial-service/memorial-service-test';
import 'lbh3/components/nav/nav-test';
import 'lbh3/components/no-ssr/no-ssr-test';
import 'lbh3/components/past-runs/past-runs-test';
import 'lbh3/components/photos-button/photos-button-test';
import 'lbh3/components/request-access/request-access-test';
import 'lbh3/components/run/attendance/attendance-test';
import 'lbh3/components/run/edit/edit-test';
import 'lbh3/components/run/run-test';
import 'lbh3/components/run-list/run-list-test';
import 'lbh3/components/snooze-button/snooze-button-test';
import 'lbh3/components/special-event/edit/edit-test';
import 'lbh3/components/special-event/special-event-test';
import 'lbh3/components/special-events/special-events-test';
import 'lbh3/components/users/edit/edit-test';
import 'lbh3/components/users/users-test';

// import 'lbh3/components/year/year-test';

F.attach(QUnit);

QUnit.module('lbh3 functional smoke test', {
  beforeEach() {
    F.open('./development.html');
  }
});

QUnit.skip('lbh3 main page shows up', function() {
  F('title').text('LBH3', 'Title is set');
});
