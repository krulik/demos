function sendJson(method, path, body) {
  const BASE_URL = 'https://turtles-remote.onrender.com';
  // const BASE_URL = 'https://localhost:3000';
  return fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(body)
  }).then((response) => {
    if (response.status > 204) {
      throw response.statusText;
    }
    return response.json();
  });
}

function me() {
  return sendJson('GET', '/player/me');
}

function makeMove({inputNumber, functionName}) {
  return sendJson('PUT', `/player/${functionName}`, {
    inputNumber
  });
}

function choosePlayer(playerId) {
  return sendJson('POST', `/player/choose`, {
    playerId
  });
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

let state = {
  playerId: undefined,
  inputNumber: undefined,
  functionName: undefined
};

// Retrieve playerId from server on first load
me().then(({playerId}) => {
  setState({playerId});
  document.forms['players'].player.value = playerId;
}).catch((err) => {
  if (err !== 'Unauthorized') {
    error(err);
  }
});

document.forms['players'].addEventListener('input', (e) => {
  choosePlayer(e.target.value)
    .then(({message}) => {
      info(message);
    })
    .catch(error);
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
  makeMove(state)
    .then(({result, message}) => {
      info(message);
    })
    .catch(error);
});