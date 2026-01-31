// This file is the same as test.js but with coverage reporting at the end
import F from 'funcunit';
import QUnit from 'qunitjs';
import 'qunitjs/qunit/qunit.css';

import 'lbh3/models/test';

import 'lbh3/components/about/about-test';
import 'lbh3/components/about/add/add-test';
import 'lbh3/components/about/mismanagement/mismanagement-test';
import 'lbh3/components/about/mismanagement/year/add/add-test';
import 'lbh3/components/about/mismanagement/year/edit/edit-test';
import 'lbh3/components/about/mismanagement/year/year-test';
import 'lbh3/components/about/privacy/privacy-test';
import 'lbh3/components/alert/alert-test';
import 'lbh3/components/erection/erection-test';
import 'lbh3/components/erection/ballots/ballots-test';
import 'lbh3/components/erection/edit/edit-test';
import 'lbh3/components/erection/eligibility/eligibility-test';
import 'lbh3/components/erection/nav/nav-test';
import 'lbh3/components/erection/results/results-test';
import 'lbh3/components/erections/erections-test';
import 'lbh3/components/footer/footer-test';
import 'lbh3/components/hareline/add/add-test';
import 'lbh3/components/hareline/add-event/add-event-test';
import 'lbh3/components/hareline/guidelines/guidelines-test';
import 'lbh3/components/hareline/hareline-test';
import 'lbh3/components/hareline/scribing/scribing-test';
import 'lbh3/components/hasher/edit/edit-test';
import 'lbh3/components/hasher/hasher-test';
import 'lbh3/components/hasher/nav/nav-test';
import 'lbh3/components/hasher-autocomplete/hasher-autocomplete-test';
import 'lbh3/components/hasher-edit-form/hasher-edit-form-test';
import 'lbh3/components/hasher-upload-headshot-button/hasher-upload-headshot-button-test';
import 'lbh3/components/hashers/add/add-test';
import 'lbh3/components/hashers/attendance-records/attendance-records-test';
import 'lbh3/components/hashers/early-warning/early-warning-test';
import 'lbh3/components/hashers/in-memoriam/in-memoriam-test';
import 'lbh3/components/hashers/hashers-test';
import 'lbh3/components/header/header-test';
import 'lbh3/components/home/home-test';
import 'lbh3/components/map/map-test';
import 'lbh3/components/nav/nav-test';
import 'lbh3/components/past-runs/map/map-test';
import 'lbh3/components/past-runs/past-runs-test';
import 'lbh3/components/past-runs/search/search-test';
import 'lbh3/components/past-runs/special/special-test';
import 'lbh3/components/past-runs/sync/sync-test';
import 'lbh3/components/request-access/request-access-test';
import 'lbh3/components/require-sign-in/require-sign-in-test';
import 'lbh3/components/run/attendance/attendance-test';
import 'lbh3/components/run/edit/edit-test';
import 'lbh3/components/run/nav/nav-test';
import 'lbh3/components/run/post/post-test';
import 'lbh3/components/run/run-test';
import 'lbh3/components/run-list/run-list-test';
import 'lbh3/components/snooze-button/snooze-button-test';
import 'lbh3/components/special-event/edit/edit-test';
import 'lbh3/components/special-event/nav/nav-test';
import 'lbh3/components/special-event/special-event-test';
import 'lbh3/components/sub-nav/sub-nav-test';
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

// Report coverage when tests complete
QUnit.done(function(details) {
  if (window.__coverage__) {
    // Send coverage data to the server via POST
    const coverageData = JSON.stringify(window.__coverage__);
    
    // Create a beacon to send coverage data
    const blob = new Blob([coverageData], { type: 'application/json' });
    
    // Try to use sendBeacon for reliability, fallback to fetch
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/coverage-report', blob);
    } else {
      fetch('/api/coverage-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: coverageData,
        keepalive: true
      });
    }
    
    // Also log a summary to console
    const files = Object.keys(window.__coverage__);
    console.log('=== COVERAGE SUMMARY ===');
    console.log(`Files instrumented: ${files.length}`);
    
    // Calculate basic coverage stats
    let totalStatements = 0;
    let coveredStatements = 0;
    
    files.forEach(file => {
      const fileCoverage = window.__coverage__[file];
      const statements = fileCoverage.s;
      Object.keys(statements).forEach(key => {
        totalStatements++;
        if (statements[key] > 0) coveredStatements++;
      });
    });
    
    const percentage = totalStatements > 0 
      ? ((coveredStatements / totalStatements) * 100).toFixed(2)
      : 0;
    
    console.log(`Statement Coverage: ${coveredStatements}/${totalStatements} (${percentage}%)`);
    console.log('========================');
    
    // Store coverage in window for external access
    window.__coverageSummary__ = {
      files: files.length,
      totalStatements,
      coveredStatements,
      percentage
    };
  }
});

QUnit.start();
