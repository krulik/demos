function makeMove({playerId, inputNumber, functionName}) {
  let fetchPromise = fetch(`http://localhost:3000/player/${functionName}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      playerId,
      inputNumber
    })
  });
  fetchPromise
    .then((response) => response.json())
    .then(({result, message}) => {
      info(message);
    })
    .catch((err) => {
      error(`Server error [${err}]`);
    });
}

function choosePlayer(playerId) {
  let fetchPromise = fetch(`http://localhost:3000/player/choose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      playerId
    })
  });
  fetchPromise
    .then((response) => response.json())
    .then(({message}) => {
      // We can't access Set-Cookie header
      // due to security reasons so we retrieve it
      // from document.cookie which is managed by the browser
      let playerId = parseCookies(document.cookie);

      info(message);
      setState({playerId});
    })
    .catch((err) => {
      error(`Server error [${err}]`);
    });
}

let state = {
  playerId: undefined,
  inputNumber: undefined,
  functionName: undefined
};

function parseCookies(cookiesString) {
  // It's a naive implementation that assumes
  // we only have one cookie
  // playerId=player1
  // ['playerId', 'player1']
  return cookiesString.split('=')[1];
}

function setState(newState) {
  state = {...state, ...newState};
  console.log(state);
}

function info(message) {
  document.querySelector('output').innerHTML = `
    <span style="color: green;">${message}</span>
  `;
}

function error(message) {
  document.querySelector('output').innerHTML = `
    <span style="color: red;">${message}</span>
  `;
}

// Retrieve playerId from cookie on first load
setState({
  playerId: parseCookies(document.cookie)
});
document.forms['players'].player.value = state.playerId;

document.forms['players'].addEventListener('input', (e) => {
  choosePlayer(e.target.value);
});

document.forms['move'].addEventListener('input', (e) => {
  if (e.target.name === 'method') {
    setState({functionName: e.target.value});
  } else if (e.target.type === 'number') {
    setState({inputNumber: Number(e.target.value)});
  }
});

document.querySelector('button').addEventListener('click', (e) => {
  e.preventDefault();
  makeMove(state);
});