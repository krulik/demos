import { data } from './data.js';

function getTurtle(turtle, config) {
  const img = document.createElement('img');
  img.src = turtle.icon;
  img.height = config.iconWidth;
  img.style.position = 'relative';
  return img;
}

function createTracks(data, config) {
  const tracks = data.map(turtle => {
    const track = document.createElement('div');
    track.style.backgroundColor = turtle.color;
    track.append(getTurtle(turtle, config));
    track.addEventListener('click', () => {
      turtle.isPaused = !turtle.isPaused;
    });
    return track;
  });
  document.querySelector('#tracks').replaceChildren(...tracks);
}

function renderTracks(data) {
  const tracks = Array.from(document.querySelectorAll('#tracks > div'));
  tracks.forEach((track, i) => {
    const turtle = data[i];
    track.querySelector('img').style.left = `${turtle.position}px`;
  });
}

function getLeadTurtle(data) {
  return data.reduce((lead, curr) => {
    if (curr.position > lead.position) {
      return curr;
    }
    return lead;
  }, data[0]);
}

function drawFrame(state, config) {
  const {game} = state;
  const data = state.data.current;
  const limit = config.limit - config.iconWidth;

  const leadTurtle = getLeadTurtle(data);
  if (leadTurtle.position + leadTurtle.speed >= limit) {
    game.winner = leadTurtle;
    game.isPlaying = false;
    renderInterface(state);
    return;
  }

  for (let turtle of data) {
    if (!turtle.isPaused) {
      turtle.position += turtle.speed;
    }
  }
  renderTracks(data);
  renderInterface(state);
  game.timerId = setTimeout(() => drawFrame(state, config), 1000 / 60);
}

function resetPosition(data, pos) {
  for (let turtle of data) {
    turtle.position = pos;
  }
}

function renderInterface(state) {
  const {game} = state;
  const winnerEl = document.querySelector('#winner');
  if (game.winner) {
    winnerEl.textContent = ` ${game.winner.name}!`;
    winnerEl.style.color = game.winner.color;
  } else {
    winnerEl.textContent = `...`;
    winnerEl.style.color = 'inherit';
  }

  document.querySelector('#restart').disabled = game.isPlaying;

  const time = (Date.now() - game.startTime) / 1000;
  document.querySelector('#clock').textContent = `${time}s`;

  document.querySelector('#timerId').textContent = game.timerId;
}

function getCopy(data) {
  return data.map(turtle => ({...turtle}));
}

function restartGame(state, config) {
  state.data.current = getCopy(state.data.initial);
  state.game.startTime = Date.now();
  state.game.winner = null;
  state.game.isPlaying = true;
  createTracks(state.data.current, config);
  resetPosition(state.data.current, 0);
  drawFrame(state, config);
}

const config = {
  limit: document.querySelector('#tracks').offsetWidth,
  iconWidth: 100
};

const state = {
  data: {
    initial: data,
    current: null
  },
  game: {
    timerId: null,
    startTime: 0,
    winner: null,
    isPlaying: false
  }
};

document.querySelector('#reset').addEventListener('click', () => {
  resetPosition(state.data.current, 0);
});
document.querySelector('#restart').addEventListener('click', () => {
  clearTimeout(state.timerId);
  restartGame(state, config);
});
restartGame(state, config);
