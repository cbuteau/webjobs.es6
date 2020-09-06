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

const DEFAULT_SETTINGS = {
  id: null,
  state: WorkerStates.STARTING
};

class WorkerProxy {
  constructor(options) {
    this.messages  = [];
    this.callbacks = [];
    this._boundOnMessage = this.onMessage.bind(this);
    this._boundOnError = this.onError.bind(this);
    var that = this;
    this.options = options;

    this.settings = Object.assign(DEFAULT_SETTINGS, {
      id: ensureId(),
      startTime: Date.now(),
    });

    this.settings.infoCallback = options.infoCallback;

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
      var pathToBase = '/src/BaseThread.js';
      if (this.options.appPath) {
        pathToBase = this.options.appPath + pathToBase;
      }

      this.settings._worker = new Worker(pathToBase, {type:'module'});
      this.settings._worker.onmessage = this._boundOnMessage;
      this.settings._worker.onerror = this._boundOnError;

    } catch(e) {
      console.error(e);
      this.updateState(WorkerStates.COMPLETED);
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
    this.settings._worker.postMessage({
      msg: MessageIds.BASEINIT,
      jobPath: options.jobPath
    });
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
        this.settings.state = WorkerStates.INITIALIZED;
        this.settings._worker.postMessage({
          msg: MessageIds.DISPATCH,
          workerId: data.workerId,
          params: this.options.jobParams
        });
        this.updateState(WorkerStates.JOB);
        break;
      case MessageIds.BASEINIT_ERROR:
        this.updateState(WorkerStates.COMPLETED);
        this.reject(data.error);
        break;
      case MessageIds.DISPATCH_COMPLETE:
        this.resolve(data.payload);
        this.updateState(WorkerStates.COMPLETED);
        break;
      case MessageIds.DISPATCH_ERROR:
        this.reject(data.error);
        this.updateState(WorkerStates.COMPLETED);
        break;
      case MessageIds.DISPATCH_INFO:
        if (this.settings.infoCallback) {
          try {
            this.settings.infoCallback(data);
          } catch (err) {
            console.error(err);
            console.error(' your callback keeps exceptioning...fix it.');
          }
        }
        break;
      default:
        console.log('Unhandled = ' + data.msg);
        break;
    }
  }

  onError(e) {
    console.error(e);
  }

  getPromise() {
    return this._promise;
  }

  subscribe(eventId, callback) {
    // if we have more events we can build a pubsub mechanism...
    this.callbacks.push(callback);
  }

  updateState(newState) {
    this.settings.state = newState;
    for (var i = 0; i < this.callbacks.length; i++) {
      this.callbacks[i](newState, this);
    }
  }

  queue(msg) {
    this.messages.push(msg);
  }

  process() {
    var msg = this.messages.pop();
    while (msg) {
      this._worker.postMessage(msg);
      msg = this.messages.pop();
    }
  }

  restart(parameters) {
    var that = this;
    this._promise = new Promise(function(resolve, reject) {
      that.resolve = resolve;
      that.reject = reject;
    });

    this.settings.infoCallback = parameters.infoCallback;

    this.jobparams = parameters.jobparams;
    this.queue({
      msg: MessageIds.BASEINIT,
      jobPath: parameters.jobPath,
      workerId: this.settings.workerId
    });
  }
}

export default WorkerProxy
