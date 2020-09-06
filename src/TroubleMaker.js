/*jslint es6 */

import ThePool from './ThePool.js'

class TroubleMaker {
  constructor() {
    this.workers = {};
    this.isSetup = false;
    this.options = {
      appPath: ''
    };
  }

  setup(options) {
    // probably remove this in the future unless
    // discuvered we have setting for every job to occur...
    this.options = options;
    this.isSetup = true;
  }

  start(options) {
    // if (!this.isSetup) {
    //   throw new Error('setup method not called.');
    // }

    var proxy = ThePool.pickup({
      jobParams: options.jobParams,
      //baseUrl: this.options.baseUrl,
      //requirePath: this.options.fullPathToRequire,
      appPath: this.options.appPath,
      jobPath: options.jobPath,
      infoCallback: options.infoCallback,
      timeout: options.timeout
    });

    this.workers[proxy.settings.workerId] = proxy;

    return proxy.getPromise();
  }

};

//export let TroubleMaker = new TroubleMaker();

//const instance = new TroubleMaker()
//export default { instance as TroubleMaker }

export default new TroubleMaker();
