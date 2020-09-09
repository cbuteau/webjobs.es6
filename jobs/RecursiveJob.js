
function factorial(n) {
  if (n >= 1) {
    return n * factorial(n - 1);
  } else {
    return 1;
  }
}


class RecursiveJob {
  constructor() {
  }

  dispatch(workerId, parameters) {
    return factorial(parameters.n);
  }
}

// you have to export AS Job because the thread calls.. new result.Job()
// makes it eaither on both sides.
// otherwise to start a job client code would have to provide file and constructor.
export { RecursiveJob as Job }
