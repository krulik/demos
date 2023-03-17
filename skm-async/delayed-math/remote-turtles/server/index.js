import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import fs from 'fs';
import https from 'https';

const MINUTE = 60 * 1000;

let app = express();

// CORS
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', 'https://localhost:5500');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  return next();
});

// Cookie example
app.use((req, res, next) => {
  res.set('Set-Cookie', `example_cookie=${(new Date()).toLocaleTimeString()}; Path=/;`)
  console.log(req.headers.cookie);
  return next();
})

app.use(cookieSession({
  name: 'session',
  secret: 'foobar',
  sameSite: 'none',
  secure: true
}))

app.use(bodyParser.json());

import fs from 'fs';
import https from 'https';

let options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
};

let server = https.createServer(options, app);
server.listen(3000, () => {
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

let state = {
  players: {
    'player1': {result: null},
    'player2': {result: null}
  }
};

app.post('/player/choose', (request, response) => {
  let {player} = request.body;
  if (!player || !(player in state.players)) {
    return response.status(400).json({
      error: `Bad or non-existent player`
    });
  }
  // Set cookie
  request.session.player = player;
  response.cookie('player', player, {
    sameSite: 'none',
    secure: true
  });

  response.status(200).json({
    message: `You've chosen player [${player}]`
  });
})

app.post('/move/', (request, response) => {
  // Check cookie
  let player = res.cookie('player');
  if (!player || !(player in state.players)) {
    return response.status(401).json({
      error: `You didn't choose a player`
    });
  }

  let {method, input} = request.body;
  if (!(method in mathFunctions)) {
    return response.status(400).json({
      error: `You didn't choose a function`
    });
  }

  if (!input) {
    return response.status(400).json({
      error: `You didn't provide an input`
    });
  }
  response.json(request.body);
});