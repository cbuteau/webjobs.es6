
import TroubleMaker from "../src/TroubleMaker.js"

import ThePool from "../src/ThePool.js"

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

fdescribe('Full back and forth', function() {


  beforeAll(function() {
    var base_url = window.location.origin;
    TroubleMaker.setup({
      appPath: base_url + '/../base'
    });
  });


  beforeEach(function() {
    // so we do NOT reuse proxies...
    ThePool.completed.length = 0;
  });

  fit ('MathJob', function(done) {
    // cover ensureId
    spyOn(Math, 'random').and.returnValues(0.1, 0.1, 0.2, 0.3, 0.4);
    var prom = TroubleMaker.start({
      jobPath: '/jobs/MathJob.js',
      jobParams: {
        param1: 10,
        param2: 20
      }
    });

    prom.then(function(result) {
      expect(result).toBe(30);
      done();
    }).catch(function(e) {
      expect(e).toBeNull();
      console.error(e);
      done();
    });;

  });

  fit ('MathJob2', function(done) {
    // cover ensureId
    spyOn(Math, 'random').and.returnValues(0.1, 0.1, 0.2, 0.3, 0.4);
    var prom = TroubleMaker.start({
      jobPath: '/jobs/MathJob.js',
      jobParams: {
        param1: 10,
        param2: 20,
        op: '*'
      }
    });

    prom.then(function(result) {
      expect(result).toBe(200);
      done();
    }).catch(function(e) {
      expect(e).toBeNull();
      console.error(e);
      done();
    });

  });

  fit ('MathJob timeout', function(done) {
    // cover ensureId
    spyOn(Math, 'random').and.returnValues(0.1, 0.1, 0.2, 0.3, 0.4);
    var prom = TroubleMaker.start({
      jobPath: '/jobs/MathJob.js',
      jobParams: {
        param1: 10,
        param2: 20
      },
      timeout: 1
    });

    prom.catch(function(err) {
      console.error(err);
      done();
    });

  });


});
