'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*jslint es6 */

var _MessageIds = require('./MessageIds.js');

var _MessageIds2 = _interopRequireDefault(_MessageIds);

var _WorkerStates = require('./WorkerStates.js');

var _WorkerStates2 = _interopRequireDefault(_WorkerStates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
  state: _WorkerStates2.default.STARTING
  // get _worker() {
  //   return this.__actualWorker;
  // }
};

var WorkerProxy = function () {
  function WorkerProxy(options) {
    _classCallCheck(this, WorkerProxy);

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
      startTime: Date.now()
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
    } catch (e) {
      console.error(e);
    }

    var that = this;
    this._promise = new Promise(function (resolve, reject) {
      that.reject = reject;
      that.resolve = resolve;
    });

    if (options.timeout) {
      setTimeout(function () {
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

  _createClass(WorkerProxy, [{
    key: 'onMessage',
    value: function onMessage(e) {
      var data = e.data;
      switch (data.msg) {
        case _MessageIds2.default.SCRIPTLOADED:
          // respond with jobPAth to initialize
          this.settings._worker.postMessage({
            msg: _MessageIds2.default.BASEINIT,
            jobPath: this.options.jobPath,
            workerId: this.settings.id
          });
          break;
        case _MessageIds2.default.BASEINIT:
          break;
        case _MessageIds2.default.BASEINIT_COMPLETE:
          break;
        case _MessageIds2.default.BASEINIT_ERROR:
          break;
      }
    }
  }, {
    key: 'onError',
    value: function onError(e) {
      console.error(e);
    }
  }, {
    key: 'getPromise',
    value: function getPromise() {
      return this._promise;
    }
  }]);

  return WorkerProxy;
}();

exports.default = WorkerProxy;