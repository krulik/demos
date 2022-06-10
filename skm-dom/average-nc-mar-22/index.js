function getNumbers() {
  const numTds = document.querySelectorAll('tbody td:nth-child(2)');
  const numbers = [];
  for (let i = 0; i < numTds.length; i++) {
    numbers.push(parseInt(numTds[i].textContent));
  }
  return numbers;
}

function getAverage(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum / numbers.length;
}

function printAverage(average) {
  const outputCell = document.querySelector('tfoot td:nth-child(2)');
  outputCell.textContent = average;
}

function handleEvent(e) {
  printAverage(
    getAverage(
      getNumbers()
    )
  );
}

const button = document.querySelector('button');
button.addEventListener('click', handleEvent());
