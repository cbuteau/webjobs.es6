/*jslint es6 */

const WorkerStates = Object.freeze({
  STARTING: 0,
  STARTED: 1,
  LOADED: 2,
  INITIALIZED: 3,
  DISPATCH: 4,
  JOB: 5,
  COMPLETED: 6
});

export default WorkerStates
