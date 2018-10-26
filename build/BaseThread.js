"use strict";

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

self.postMessage({
  msg: 0
});