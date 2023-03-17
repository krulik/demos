function choose(player) {
  let fetchPromise = fetch(`https://localhost:3000/player/choose`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({player})
  });
  fetchPromise
    .then((response) => response.json())
    .then((jsonResponse) => {
      if ('error' in jsonResponse) {
        error(`Server said [${jsonResponse.error}]`);
      } else {
        log(jsonResponse.message);
      }
    })
    .catch(err => {
      error(`Big problem [${err}]`);
    });
}

function move(state) {
  let fetchPromise = fetch(`https://localhost:3000/move`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(state)
  });
  fetchPromise
    .then((response) => response.json())
    .then((jsonResponse) => {
      if ('error' in jsonResponse) {
        error(`Server said [${jsonResponse.error}]`);
      } else {
        log(JSON.stringify(jsonResponse));
      }
    })
    .catch(err => {
      error(`Big problem [${err}]`);
    });
}

let state = {
  currentPlayer: '',
  input: null,
  method: ''
};

function error(msg) {
  document.querySelector('output').innerHTML = `
    <span style="color: red;">${msg}</span>
  `;
}

function log(msg) {
  document.querySelector('output').innerHTML = `
  <span style="color: green;">${msg}</span>
  `;
}

function setState(newState) {
  state = {...state, ...newState};
  console.log(state);
}

document.forms['method'].addEventListener('input', e => {
  setState({method: e.target.value});
});

document.forms['move'].addEventListener('input', e => {
  if (e.target.name === 'player') {
    setState({currentPlayer: e.target.value});
    choose(state.currentPlayer);
  } else if (e.target.type === 'number') {
    setState({input: Number(e.target.value)});
  }
});

document.querySelector('button').addEventListener('click', e => {
  e.preventDefault();
  move(state);
});