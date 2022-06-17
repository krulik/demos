import {grades} from './grades.js';

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
  outputCell.textContent = average.toFixed(1);
}

function handleEvent(e) {
  printAverage(
    getAverage(
      getNumbers()
    )
  );
}

function getRows(grades) {
  return grades.map(student => {
    const row = document.createElement('tr');
    const name = document.createElement('td');
    const grade = document.createElement('td');
    name.append(student.name);
    grade.append(student.grade);
    row.append(name, grade);
    return row;
  });
}

function getColumn(key, value) {
  const column = document.createElement('td');
  switch (key) {
      case 'name':
        column.style.fontFamily = 'cursive';
        column.append(value);
        break;
      case 'grade':
        column.style.fontFamily = 'monospace';
        column.append(value);
        break;
      case 'color':
        column.style.backgroundColor = value;
        column.style.width = '30px';
        break;
      default:
        column.append(value);
        break;
  }
  return column;
}

function getRowsDynamic(grades) {
  return grades.map(student => {
    const row = document.createElement('tr');
    for (let [key, value] of Object.entries(student)) {
      row.append(getColumn(key, value));
    }
    return row;
  });
}

function getColumns(grades) {
  return Object.keys(grades[0]).map(name => {
    const td = document.createElement('th');
    td.append(name);
    return td;
  });
}

function buildTable(columns, rows) {
  const header = document.querySelector('thead > tr');
  header.append(...columns)

  const tbody = document.querySelector('tbody');
  tbody.append(...rows);
}

buildTable(
  getColumns(grades),
  getRowsDynamic(grades)
);

const button = document.querySelector('button');
button.addEventListener('click', handleEvent);
