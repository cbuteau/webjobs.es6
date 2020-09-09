/* jslint es6 */

class MathJob {
  constructor() {
  }

  dispatch(workerId, parameters) {
    var op = '+';
    if (parameters && parameters.op) {
      op = parameters.op;
    }
    var result;
    switch (op) {
      case '+':
        result = parameters.param1 + parameters.param2;
        break;
      case '-':
        result = parameters.param1 - parameters.param2;
        break;
      case '*':
        result = parameters.param1 * parameters.param2;
        break;
      case '/':
        result = parameters.param1 / parameters.param2;
        break;
    }
    if (isNaN(result)) {
      throw new Error('IsNaN man...');
    }
    if (!isFinite(result)) {
      throw new Error('Infinity Gauntlet');
    }

    return result;
  }
}

// you have to export AS Job because the thread calls.. new result.Job()
// makes it eaither on both sides.
// otherwise to start a job client code would have to provide file and constructor.
export { MathJob as Job }
