/*jslint es6 */

import WorkerProxy from './WorkerProxy.js'

class TroubleMaker {
  constructor() {
  }

  setup(options) {
    this.options = options;
  }

  start(options) {
    var proxy = new WorkerProxy({
      jobPath: options.jobPath,
      jobParams: options.jobParams,
      timeout: options.timeout
    });

    return proxy.getPromise();
  }
};

//export let TroubleMaker = new TroubleMaker();

//const instance = new TroubleMaker()
//export default { instance as TroubleMaker }

export default new TroubleMaker();
