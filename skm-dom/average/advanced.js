'use strict';

let sum = arr => arr.reduce((sum, val) => sum + val, 0);
let avg = arr => sum(arr) / arr.length;
let $ = selector => document.querySelector(selector);
let $$ = selector => document.querySelectorAll(selector);

function calcAverage({button, numbers, output}) {
  $(button).addEventListener('click', () => {
    $(output).textContent = avg(
      Array.from($$(numbers))
        .map(cell => cell.textContent.match(/\d/g).join(''))
        .map(Number)
      );
  });
}