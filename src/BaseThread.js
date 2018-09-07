/* jslint es6 */


onMessage(e) {
  var data = e.data;
  switch (data.msg) {
    case 1:

      import(data.jobPath).then(dispatcher) {
        self.dispatcher = new dispatcher();
        postMessage({
          msg: 2,
          workerId: data.workerId
        })
      }.catch(function(e) {
        console.error(e);
        console.log('failed to import job');
      })

      break;
  }
}

postMessage({
  msg: 1
})