console.log('hello world');

let pageTitle = document.querySelector('h1');
let link = document.querySelector('a');

console.log(pageTitle.textContent);

let now = new Date();

let date = now.toLocaleDateString('he-IL');
let time = now.toLocaleTimeString('he-IL');

pageTitle.textContent += ` ${date} - ${time}`;


function turnPink(eventInfo) {
  console.log(eventInfo);

  eventInfo.preventDefault();

  eventInfo.target.style.color = 'hotpink';
}


pageTitle.addEventListener('click', turnPink);
link.addEventListener('click', turnPink);