
import WorkerProxy from './WorkerProxy.js'
import WorkerStates from './WorkerStates.js'

class ThePool {
  constructor() {
    this.list = [];
    this.completed = [];
    this.boundStateUpdate = this.stateUpdate.bind(this);
  }
  dropoff(worker) {
    var myindex = this.list.indexOf(worker);
    this.completed.push(worker);
    this.list.splice(myindex, 1);
  }
  pickup(parameters) {
    var worker;
    if (this.completed.length > 0) {
      worker = this.completed.pop();
    }

    if (worker === undefined) {
      // spawn by parameters passed in...
      worker = new WorkerProxy(parameters);
      worker.subscribe('StateChanged', this.boundStateUpdate);
      this.list.push(worker);
    } else {
      worker.restart(parameters);
    }

    return worker;
  }
  stateUpdate(state, worker) {
    if (state === WorkerStates.COMPLETED) {
      this.dropoff(worker);
    }
  }
}

export default new ThePool();
