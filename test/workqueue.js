
import WorkQueue from "../src/WorkQueue.js"

class SuccessWork {
  constructor() {

  }

  execute(parts) {
    for (var i = 0; i < 10000; i++) {
      console.log(i);
    }
    parts.resolve(i);
  }
}

class FailureWork {
  constructor() {

  }

  execute(parts) {
    parts.reject(true);
  }
}


fdescribe('test WorkQueue...', function() {

  fit('Success', function() {
    return new Promise(function(resolve, reject) {
      WorkQueue.queue(new SuccessWork()).then(resolve);
    });
  });

  fit('Failure', function() {
    return new Promise(function(resolve, reject) {
      WorkQueue.queue(new FailureWork()).catch(resolve);
    });
  });

});
