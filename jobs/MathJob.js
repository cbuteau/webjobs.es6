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

export { MathJob as Job }
