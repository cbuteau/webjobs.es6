/*jslint es6 */

import MessageIds from './MessageIds.js';

import WorkerStates from './WorkerStates.js';


var currentIds = [];

function getId() {
  return '' + Math.random().toString(36).substr(2, 9);
}

function ensureId() {
  var id = getId();
  while (currentIds.indexOf(id) !== -1) {
    id = getId();
  }
  currentIds.push(id);
  return id;
}

var defaultSettings = {
  id: null,
  state: WorkerStates.STARTING
  // get _worker() {
  //   return this.__actualWorker;
  // }
};

class WorkerProxy {
  constructor(options) {
    this._boundOnMessage = this.onMessage.bind(this);
    this._boundOnError = this.onError.bind(this);
    var that = this;
    this.options = options;

    // this.settings = {
    //   is: ensureId(),
    //   startTime: Date.now(),
    //   state: WorkerStates.STARTING,
    //   get _worker() {
    //     return this.__actualWorker;
    //   }
    // };

    this.settings = Object.assign({
      id: ensureId(),
      startTime: Date.now(),
    }, defaultSettings);

    try {
      // this.settings.__actualWorker = new Worker('./src/BaseThread.js', {
      //   type: 'module',
      //   credentials: 'same-origin',
      //   name: this.settings.id
      // });

      // this.settings.__actualWorker = new Worker('/src/BaseThread.js', {
      //   type: 'module',
      // });

      //this.settings.__actualWorker = new Worker('/src/BaseThread.js');
      this.settings._worker = new Worker('/src/BaseThread.js');
      this.settings._worker.addEventListener('message', this._boundOnMessage);
      //this.settings._worker.addEventListener('error', this._boundOnError);
      //this.settings._worker.onmessage = this._boundOnMessage;
      this.settings._worker.onerror = this._boundOnError;

    } catch(e) {
      console.error(e);
    }


    var that = this;
    this._promise = new Promise(function(resolve, reject) {
      that.reject = reject;
      that.resolve = resolve;
    });

    if (options.timeout) {
      setTimeout(function() {
        that.rejectReason = 'timeout';
        that.reject(new Error('Job Timeout'));
      }, options.timeout);
    }

    // maybe post message to initialize?
    this.settings._worker.postMessage({ msg: 13 });

    // this.settings._worker.postMessage({
    //   msg: MessageIds.BASEINIT,
    //   jobPath: options.jobPath
    // });
  }

  onMessage(e) {
    var data = e.data;
    switch (data.msg) {
      case MessageIds.SCRIPTLOADED:
        // respond with jobPAth to initialize
        this.settings._worker.postMessage({
          msg: MessageIds.BASEINIT,
          jobPath: this.options.jobPath,
          workerId: this.settings.id
        });
        break;
      case MessageIds.BASEINIT:
        break;
      case MessageIds.BASEINIT_COMPLETE:
        break;
      case MessageIds.BASEINIT_ERROR:
        break;
    }
  }

  onError(e) {
    console.error(e);
  }

  getPromise() {
    return this._promise;
  }
}

export default WorkerProxy
