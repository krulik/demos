import { clocksConfig } from './clocks.js';

function getOffsetTime(time, offset) {
  const offsetTime = new Date(time);
  const hours = offsetTime.getHours();
  offsetTime.setHours(hours + offset);
  return offsetTime;
}

function getClocks(clocksConfig) {
  const now = new Date();
  return clocksConfig.map(clock => {
    const clockTime = getOffsetTime(now, clock.offset)
    return {
      name: clock.name,
      time: clockTime.toLocaleTimeString()
    };
  });
}

function displayClocks(clocks) {
  const list = document.querySelector('#list');
  list.replaceChildren(...clocks.map(clock => {
    const li = document.createElement('li');
    li.append(`${clock.name}: ${clock.time}`);
    return li;
  }));
}

function tick() {
  displayClocks(getClocks(clocksConfig));
  setTimeout(tick, 1000);
}

tick();

