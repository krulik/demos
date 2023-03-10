function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  if (a < b) {
    return `Result must be positive...`;
  }
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return `Can't divide by zero...`;
  }
  return a / b;
}

function math(fn, a, b, callback) {
  setTimeout(() => {
    let res = fn(a, b);

    console.log(`${a} ${fn.name} ${b} = ${res}`);

    if (typeof res === 'string') {
      throw Error(res);
    }

    callback(res);
  }, 1000);
}

math(add, 2, 2, (res) => {
  math(multiply, res, 10, (res) => {
    math(divide, res, 4, (res) => {
      math(subtract, res, 10, (res) => {
        console.log('done');
      });
    });
  });
});