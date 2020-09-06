
class PromiseParts {
  constructor() {
    var that = this;
    this._promise = new Promise(function(resolve, reject) {
      that.resolve = resolve;
      that.reject = reject;
    });
  }
}

class WorkQueue {
  constructor() {
    this.work = [];
    this._boundRaf = this._raf.bind(this);
    this._start();
  }

  queue(workObject) {
    var context = {
      work: workObject,
      parts: new PromiseParts()
    }
    this.work.push(context);
    return context.parts._promise;
  }

  _raf() {
    var counter = 0;

    while (this.work.length) {
      var workContext = this.work.pop();
      var parts = new PromiseParts();
      workContext.work.execute.call(workContext.work, workContext.parts);
      counter++;
    }

    if (counter === 0) {
      return;
    }

    this._start();
  }

  _start() {
    requestAnimationFrame(this._boundRaf);
  }
}

export default new WorkQueue();
