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
  origin: 'https://localhost:3000',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'x-csrf-token'],
  credentials: true
}));

app.use(cookieSession({
  name: 'clientUserId',
  secret: 'mySecret',
  sameSite: 'none',
  secure: true,
  httpOnly: true,
  maxAge: 5 * MINUTE
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


let port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server listening on port=${port} env=${process.env.NODE_ENV}`);
});

let db = {
  'user1': {
    id: 'user1',
    email: 'serge@krul.com',
    name: 'Serge',
  },

  findByEmail(email) {
    for (let user of Object.values(this)) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }
};

function authMiddleware(request, response, next) {
  let clientUserId = request.session.clientUserId;
  if (!clientUserId || !(clientUserId in db)) {
    request.session = null;
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

app.get('/users/me', authMiddleware, refreshMiddleware, (request, response) => {
  response.json(db[request.session.clientUserId]);
});

app.get('/feed', authMiddleware, refreshMiddleware, (request, response) => {
  response.json([
    {title: 'Good night', text: 'lorem'},
    {title: 'Good morning', text: 'ipsum'}
  ]);
});

app.post('/like', authMiddleware, refreshMiddleware, (request, response) => {
  response.json({
    text: 'i like you too'
  });
});

app.post('/logout', (request, response) => {
  request.session = null;
  response.sendStatus(303);
})

app.post('/login', doubleCsrfProtection, (request, response) => {
  let { email } = request.body;
  if (!email) {
    return response.sendStatus(400);
  }
  let user = db.findByEmail(email);
  if (!user) {
    request.session = null;
    return response.sendStatus(401);
  }
  request.session.clientUserId = user.id;
  response.sendStatus(204);
});