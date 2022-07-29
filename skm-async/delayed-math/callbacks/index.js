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
  setTimeout(() => {
    const result = fn(a, b);
    if (result instanceof Error) {
      throw result;
    }
    console.log(result);
    return result;
  }, 1000);
}

function handleError(err) {
  console.error(`something's wrong: ${err}`)
}

delayedMath(add, 11, 2, (err, res) => {
  if (err) {
    return handleError(err);
  }
  delayedMath(subtract, res, 3, (err, res) => {
    if (err) {
      return handleError(err);
    }
    delayedMath(multiply, res, 4, (err, res) => {
      if (err) {
        return handleError(err);
      }
      delayedMath(divide, res, 0, (err, res) => {
        if (err) {
          return handleError(err);
        }
        console.log('done', res);
      })
    })
  })
})