import express from 'express';
import cors from 'cors';

let app = express();

app.use(cors());

app.listen(3000, () => {
  console.log(`Started listening on port 3000`);
});

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

let mathFunctions = {
  'add': add,
  'multiply': multiply,
  'divide': divide,
  'subtract': subtract
};

app.get('/math/:fnName', (request, response) => {
  let fn = mathFunctions[request.params.fnName];
  let a = Number(request.query.a);
  let b = Number(request.query.b);

  let result = fn(a, b);

  response.json({
    res: result
  });
});