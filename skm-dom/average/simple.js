'use strict';

function calcAverage(options) {
  let button = document.querySelector(options.button);
  let output = document.querySelector(options.output);

  button.addEventListener('click', function() {
    let numberElements = document.querySelectorAll(options.numbers);
    let numbers = [];
    for (let el of numberElements) {
      numbers.push(Number(el.textContent.match(/\d/g).join('')));
    }
    output.textContent = avg(numbers);
  });
}

function avg(arr) {
  return sum(arr) / arr.length;
}

function sum(arr) {
  let sum = 0;
  for (let num of arr) {
    sum += num;
  }
  return sum;
}