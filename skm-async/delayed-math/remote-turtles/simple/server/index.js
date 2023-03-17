import express from 'express';
import bodyParser from 'body-parser';

let app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5500');
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set('Access-Control-Allow-Credentials', 'true');
  return next();
});

app.listen(3000, () => {
  console.log(`Started server on port 3000`);
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

let db = {
  'player1': {lastResult: 0},
  'player2': {lastResult: 0}
};

app.put('/player/:functionName', (request, response) => {
  let fn = mathFunctions[request.params.functionName];

  let playerId = request.headers.cookie.split('=')[1];

  let {inputNumber} = request.body;
  let {lastResult} = db[playerId];
  let result = fn(lastResult, inputNumber);

  db[playerId].lastResult = result;

  response.json({
    result,
    message: `Result for ${playerId} is ${result}`
  });
});

app.post('/player/choose', (request, response) => {
  let {playerId} = request.body;
  response.set('Set-Cookie', `playerId=${playerId}; Path=/;`);
  response.json({
    message: `You've chosen player [${playerId}]`
  });
});