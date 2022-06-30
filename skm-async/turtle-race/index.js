import { data } from './data.js';


function createTurtle(turtle) {
  const img = document.createElement('img');
  img.src = turtle.icon;
  img.height = 50;
  img.style.position = 'relative';
  img.style.transform = `translateX(${turtle.position}px)`;
  img.style.willChange = 'transform';
  img.style.top = `25px`;
  return img;
}

function createTracks(data) {
  const tracks = data.map(turtle => {
    const track = document.createElement('div');
    track.style.height = '100px';
    track.style.backgroundColor = turtle.color;
    track.append(createTurtle(turtle));
    track.addEventListener('click', (e) => {
      onClickTrack(e.target, turtle);
    });
    return track;
  });
  document.querySelector('#tracks').replaceChildren(...tracks);
}

function updateTracks(data) {
  Array.from(document.querySelectorAll('#tracks > div')).forEach((track, i) => {
    track.querySelector('img').style.transform = `translateX(${data[i].position}px)`;
  })
}

function getLead(data) {
  return data.reduce((max, curr) => {
    if (curr.position > max.position) {
      return curr;
    }
    return max;
  }, data[0]);
}

function tick(state, data, config) {
  const {limit, iconWidth} = config;
  const {gameTimer} = state;
  const lead = getLead(data);
  if (lead.position + lead.speed + iconWidth > limit) {
    state.winner = lead;
    state.isPlaying = false;
    setState(state);
    return;
  }
  for (let turtle of data) {
    if (!turtle.isPaused) {
      turtle.position += turtle.speed;
    }
  }
  updateTracks(data);
  gameTimer.id = requestAnimationFrame(() => tick(state, data, config), 1000 / 60);
  setState(state);
}

function onClickTrack(track, turtle) {
  turtle.isPaused = !turtle.isPaused;
}

function resetPosition(data, pos) {
  data.forEach(turtle => {
    turtle.position = pos;
  });
}

function start(state, data, config) {
  data = data.map(turtle => ({...turtle}));
  createTracks(data);
  resetPosition(data, 0);
  state.isPlaying = true;
  state.startTime = Date.now();
  tick(state, data, config);
}

function setState(state) {
  state = state;
  renderInterface(state);
}

function renderInterface(state) {
  const winnerEl = document.querySelector('#winner');
  const timeEl = document.querySelector('#time');
  const speedEl = document.querySelector('#speed');
  const restartBtn = document.querySelector('#restart');

  restartBtn.disabled = state.isPlaying;

  const time = (Date.now() - state.startTime) / 1000;
  timeEl.textContent = `${time}s`;

  if (state.winner) {
    winner.textContent = ` ${state.winner.name}!!!`;
    winnerEl.style.color = state.winner.color;
  }

  if (state.isPlaying) {
    winnerEl.textContent = '...';
    winnerEl.style.color = 'unset';
  } else {
    speedEl.textContent = `${(config.limit / time).toFixed(2)} px/s`;
  }
}

const config = {
  limit: document.querySelector('#tracks').offsetWidth,
  iconWidth: 50
};
const state = {
  gameTimer: {id: null},
  winner: null,
  isPlaying: false,
  startTime: null
};

window.addEventListener('resize', () => {
  config.limit = document.querySelector('#tracks').offsetWidth;
});
document.querySelector('#reset').addEventListener('click', () => resetPosition(data, 0));
document.querySelector('#restart').addEventListener('click', () => {
  clearTimeout(state.gameTimer.id);
  start(state, data, config);
});

start(state, data, config);