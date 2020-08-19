/* jslint es6 */


// self.onMessage(e) {
//   var data = e.data;
//   switch (data.msg) {
//     case 1:
//
//       import(data.jobPath).then(dispatcher) {
//         self.dispatcher = new dispatcher();
//         postMessage({
//           msg: 2,
//           workerId: data.workerId
//         })
//       }.catch(function(e) {
//         console.error(e);
//         console.log('failed to import job');
//         postMessage({
//           msg: 3,
//           workerId: data.workerId
//         })
//       })
//
//       break;
//   }
// }

console.log('we are in thread');
console.log(self);

// trying this maybe webworkers cannot be es6 now..

function convertError(error) {
  var converted = {
    message: error.message,
    stack: error.stack
  };

  if (error.code) {
    converted.code = error.code;
  }

  return converted;
}

onmessage = function(e) {
  var data = e.data;
  console.log('msg in' + data.msg);
  switch (data.msg) {
    case 1:
      import(data.jobPath).then(function(dispatcher) {
        self.dispatcher = new dispatcher.Job();
        postMessage({
          msg: 2,
          workerId: data.workerId
        });
      }).catch(function(err) {
        console.error(err);
        postMessage({
          msg: 3,
          workerId: data.workerId
        });
      });
      break;
    case 4:
      try {
        var result = self.dispatcher.dispatch(data.workerId, data.params);
        postMessage({
          msg: 5,
          payload: result
        });
      } catch(err) {
        postMessage({
          msg: 6,
          error: convertError(err)
        });
      }
      break;
  }
}

self.postMessage({
  msg: 0
});
