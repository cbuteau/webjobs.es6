
function request(url, verb, body, onComplete, onFailure) {

  var xhr;

  if (self.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    // I hate IE
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }

  function transferComplete(evt) {
    console.log("The transfer is complete.");
    onComplete(JSON.parse(evt.currentTarget.responseText));
  }

  function transferFailed(evt) {
    console.log("An error occurred while transferring the file.");
  }

  function transferCanceled(evt) {
    console.log("The transfer has been canceled by the user.");
  }

  xhr.addEventListener("load", transferComplete);
  xhr.addEventListener("error", transferFailed);
  xhr.addEventListener("abort", transferCanceled);


  xhr.open(verb, url);
  xhr.send();
}


class GenericWebServiceJob {
  constructor() {}

  dispatch(workerId, parameters) {
    return new Promise(function(resolve, reject) {
      request(parameters.url, parameters.verb, null, function(data) {
        resolve({
          workerId: workerId,
          payload: data
        });
      }, function(err) {
        reject({
          workerId: workerId,
          isError: true,
          payload: err
        });
      });
    });
  }
}

// you have to export AS Job because the thread calls.. new result.Job()
// makes it eaither on both sides.
// otherwise to start a job client code would have to provide file and constructor.
export {GenericWebServiceJob as Job}
