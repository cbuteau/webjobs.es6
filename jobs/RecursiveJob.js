
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
    return factorial(params.n);
  }
}

export { RecursiveJob as Job }
