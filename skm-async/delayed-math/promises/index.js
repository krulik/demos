function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  if (a < b) {
    return Error('a must be larger than b');
  }
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return Error(`can't divide by zero`);
  }
  return a / b;
}

function delayedMath(fn, a, b) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const result = fn(a, b);
      if (result instanceof Error) {
        reject(result);
        return;
      }
      console.log(result);
      resolve(result);
    }, 1000);
  });
}

delayedMath(add, 11, 2)
 .then(result => delayedMath(subtract, result, 3))
 .then(result => delayedMath(multiply, result, 4))
 .then(result => delayedMath(divide, result, 0))
 .then(result => console.log('done', result))
 .catch(error => console.error(`something's wrong: ${error}`))