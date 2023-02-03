let input = document.querySelector('input');
let fieldset = document.querySelector('fieldset');

input.addEventListener('keydown', onKeyDown);

function onKeyDown (e) {
  let isError = isForbidden(e.key);
  if (isError) {
    e.preventDefault();
    console.error(`${e.key} is forbidden!`);
  } else {
    console.log(`User pressed '${e.key}'`);
  }
  fieldset.classList.toggle('error', isError);
}

function isForbidden (key) {
  let badKeys = ['q', 'x', 'w'];
  return badKeys.indexOf(key) >= 0;
}
