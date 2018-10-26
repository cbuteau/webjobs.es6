'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TroubleMaker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*jslint es6 */

var _WorkerProxy = require('./WorkerProxy.js');

var _WorkerProxy2 = _interopRequireDefault(_WorkerProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TroubleMaker = function () {
  function TroubleMaker() {
    _classCallCheck(this, TroubleMaker);
  }

  _createClass(TroubleMaker, [{
    key: 'setup',
    value: function setup(resolver) {}
  }, {
    key: 'start',
    value: function start(options) {
      var proxy = new _WorkerProxy2.default({
        jobPath: options.jobPath,
        jobParams: options.jobParams,
        timeout: options.timeout
      });

      return proxy.getPromise();
    }
  }]);

  return TroubleMaker;
}();

;

//export let TroubleMaker = new TroubleMaker();

var instance = new TroubleMaker();
exports.TroubleMaker = instance;

//export default new TroubleMaker();