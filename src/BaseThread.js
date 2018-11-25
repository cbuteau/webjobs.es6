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

onmessage = function(e) {
  var data = e.data;
  console.log('msg in' + data.msg);
  switch (data.msg) {
    case 1:
      import(data.jobPath).then(function(dispatcher) {
        self.dispatcher = new dispatcher();
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
  }
}

self.postMessage({
  msg: 0
});
