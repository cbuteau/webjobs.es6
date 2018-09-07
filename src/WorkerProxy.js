/*jslint es6 */

import MessageIds from './MessageIds.js';

import WorkerStates from './WorkerStates.js';


var currentIds = [];

function getId() {
  return '' + Math.random().toString(36).substr(2, 9);
}

function ensureId() {
  var id = getId();
  while (currentIds.indexOf(id) !== 0) {
    id = getId();
  }
  currentIds.push(id);
  return id;
}

var defaultSettings = {
  id: null,
  state: WorkerStates.STARTING,
  get _worker() {
    return this.__actualWorker;
  }
};

class WorkerProxy {
  constructor(options) {
    this._boundOnMessage = this.onMessage.bind(this);
    var that = this;
    this.options = options;

    this.settings = Object.assign({}, {
      id: ensureId(),
      startTime: Date.now(),
    }, defaultSettings);

    this.settings.__actualWorker = new WebWorker('./src/BaseThread.js', {
      type: 'module',
      credentials: 'same-origin',
      name: this.settings.id
    });

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
        break;
      case MessageIds.BASEINIT_ERROR:
        break;
    }
  }
}

export default WorkerProxy
