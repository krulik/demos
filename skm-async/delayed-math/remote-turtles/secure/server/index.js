import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import {doubleCsrf} from 'csrf-csrf';


const MINUTE = 1 * 60 * 1000;

let app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
  origin: 'https://localhost:5500',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'x-csrf-token'],
  credentials: true
}));

app.use(cookieSession({
  name: 'playerId',
  secret: 'krang',
  sameSite: 'none',
  secure: true,
  httpOnly: true,
  maxAge: 1 * MINUTE
}));

const {
  doubleCsrfProtection,
  generateToken
} = doubleCsrf({
  getSecret: () => 'secret'
});

let options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
};
let server = https.createServer(options, app);


let port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port=${port} env=${process.env.NODE_ENV}`);
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
  'player1': { lastResult: 0 },
  'player2': { lastResult: 0 }
};

function authMiddleware(request, response, next) {
  let playerId = request.session.playerId;
  if (!playerId || !(playerId in db)) {
    return response.sendStatus(401);
  }
  return next();
}

function refreshMiddleware(request, response, next) {
  request.session.refreshTime = Date.now();
  return next();
}

app.get('/csrf', (request, response) => {
  const csrfToken = generateToken(response, request);
  response.json({csrfToken});
});

app.get('/player/me', doubleCsrfProtection, authMiddleware, refreshMiddleware, (request, response) => {
  response.json({
    playerId: request.session.playerId
  });
});

app.put('/player/:functionName', doubleCsrfProtection, authMiddleware, refreshMiddleware, (request, response) => {
  let playerId = request.session.playerId;

  if (!(request.params.functionName in mathFunctions)) {
    return response.sendStatus(400);
  }
  let { inputNumber } = request.body;
  if (isNaN(inputNumber)) {
    return response.sendStatus(400);
  }

  let fn = mathFunctions[request.params.functionName];

  let { lastResult } = db[playerId];
  let result = fn(lastResult, inputNumber);

  db[playerId].lastResult = result;

  response.json({
    result,
    message: `Result for ${playerId} is ${result}`
  });
});

app.post('/player/choose', doubleCsrfProtection, (request, response) => {
  let { playerId } = request.body;
  if (!playerId || !(playerId in db)) {
    return response.sendStatus(401);
  }
  request.session.playerId = playerId;
  response.json({
    message: `You've chosen player [${playerId}]`
  });
});