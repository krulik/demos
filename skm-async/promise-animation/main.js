let object = document.querySelector('#object');

object.addEventListener('click', e => {
  enlarge(e.target)
    .then(rotate)
    .then(moveRight)
    .then(() => alert('done'))
    .catch(err => console.error(`Got error: [${err}]`));
});

function enlarge(element) {
  return animate(element, '--scale', 1.5, 0.05, v => v);
}

function rotate(element) {
  return animate(element, '--rotate', 360, 5, v => `${v}deg`);
}

function moveRight(element) {
  return animate(element, '--translateX', 100, 2, v => `${v}px`);
}

function animate(element, propName, targetValue, step, getValue) {
  return new Promise((resolve, reject) => {
    let timerId;

    function frame() {
      let prop = parseFloat(getComputedStyle(element).getPropertyValue(propName));
      if (isNaN(prop)) {
        reject('Number expected');
        return;
      }
      if (prop >= targetValue) {
        cancelAnimationFrame(timerId);
        resolve(element);
        return;
      }
      element.style.setProperty(propName, getValue(prop + step));
      timerId = requestAnimationFrame(frame);
    }

    timerId = requestAnimationFrame(frame);
  });
}