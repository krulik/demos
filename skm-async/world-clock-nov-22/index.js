// 0. How does our Model look like?
const clocksConfig = [
  {
    cityName: 'London',
    gmtOffset: 0
  },
  {
    cityName: 'Jerusalem',
    gmtOffset: 2
  },
  {
    cityName: 'Zanzibar',
    gmtOffset: 3
  },
  {
    cityName: 'Dubai',
    gmtOffset: 4
  },
  {
    cityName: 'New York',
    gmtOffset: -5,
  },
  {
    cityName: 'Bangkok',
    gmtOffset: 5
  }
];

// 1. Create the list (every second)
function createList(clocksConfig) {
  let list = document.createElement('ul');
  for (let city of clocksConfig) {
    let item = document.createElement('li');
    item.textContent = `${city.cityName}: ${getTime(city).toLocaleTimeString()}`;
    list.append(item);
  }
  return list;
}

// 2. calculate the time for one city
function getTime(city) {
  let time = new Date();
  time.setHours(time.getUTCHours() + city.gmtOffset);
  return time;
}

// 3. Make the clock tick - repeat the timer
// 3a. What happens every tick
function tick() {
  document.querySelector('#clocks').replaceChildren(
    createList(clocksConfig)
  );
  // 3b. Repeat the timer - call for the next click
  setTimeout(tick, 1000);
}

// 3c. Kick-off the clock
tick();