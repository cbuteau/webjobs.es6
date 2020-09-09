
// checked in ...KimCosmic song...
// from here... https://freemusicarchive.org/search?adv=1&quicksearch=dub&&
// yopu can pick something else.

class BinaryProcessingJob {
  constructor() {}

  dispatch(workerId, parameters) {
    return new Promise(function(resolve, reject) {
      // we might need to pass in appPath so they can form a file filepath.
      var filePath = parameters.filePath;
      // load file
      // Move to TypedArray.
      // Calculate mean and something else

      resolve({
        array: new Uint8Array(200),
        count: 200
      });
    });
  }
}

// you have to export AS Job because the thread calls.. new result.Job()
// makes it eaither on both sides.
// otherwise to start a job client code would have to provide file and constructor.
export {BinaryProcessingJob as Job}
