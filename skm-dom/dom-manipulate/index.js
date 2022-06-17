const root = document.querySelector('#root');

const myElement = document.createElement('h1');
myElement.append('Good morning');
myElement.classList.add('special-title');
myElement.classList.add('important-text');

myElement.style.position = 'relative';
myElement.style.top = `${50 + 50}px`;


const newStyle = document.createElement('style');
newStyle.append(`.new-class {
  top: ${60 - 60}px !important;
}`);
document.body.append(newStyle);

root.append(myElement);

myElement.classList.add('new-class');