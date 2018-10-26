"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*jslint es6 */

var WorkerStates = Object.freeze({
  STARTING: 0,
  STARTED: 1,
  LOADED: 2,
  INITIALIZED: 3,
  DISPATCH: 4,
  JOB: 5,
  COMPLETED: 6
});

exports.default = WorkerStates;