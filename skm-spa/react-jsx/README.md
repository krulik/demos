# React-JSX-Webpack Project Template

A minimal template with:
- React
- JSX
- Webpack
- ExpressJS server

Inspired by:
- [React Docs](https://reactjs.org/docs/create-a-new-react-app.html#creating-a-toolchain-from-scratch)
- [Creating a React App… From Scratch.](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)
- [How to Create a React app from scratch using Webpack 4](https://medium.freecodecamp.org/part-1-react-app-from-scratch-using-webpack-4-562b1d231e75)

## Setup
To install the project dependencies:
```
npm install
cd server
npm install
```

## Development

During development the client code is served by Webpack Dev Server (`http://localhost:3000`) and tries to connect to the Express server on `http://localhost:8000` (see below).

```
npm start
```

This is watching and compiling from the `./src` folder into the `./public` folder (using hot-module-replacement).

### Server
The server has its own `package.json` inside the `./server` folder and to run it first `cd server` and `npm start`. It will open the Express server on `http://localhost:8000`

## Production

For production client code is bundled into the `./public/` folder and is served by the ExpressJS alone on `http://localhost:8000` (no Webpack Dev Server needed on production).

To build:
```
npm run build
```

To run:
```
cd server
npm start
```