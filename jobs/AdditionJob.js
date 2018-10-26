/* jslint es6 */

class AdditionJob {
  constructor() {
  },

  dispatch(parameters) {
    return parameters.param1 + parameters.param2;
  }
}

export AdditionJob;
