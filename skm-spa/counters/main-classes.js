'use strict';

const DEFAULT_VIEW = 'counters';

class Counters {
  constructor() {
    this.children = [
      new Counter({start: 1}),
      new Counter({start: 2}),
      new Counter({start: 3})
    ];
  }
  render() {
    return `
      <ul>
        ${this.children.map(counter => `
          <li>
            ${counter.render()}
          </li>
        `).join('')}
      </ul>
    `;
  }
}

class Counter {
  constructor(props) {
    this.id = `counter_${Math.random()}`;
    this.state = {
      num: props.start
    };
  }
  add() {
    setState(this, {num: this.state.num + 1});
  }
  substract() {
    setState(this, {num: this.state.num - 1});
  }
  render() {
    return `
      <div>
        <span>${this.state.num}</span>
        <button onclick="action('${this.id}', 'add', event)">Add</button>
        <button onclick="action('${this.id}', 'substract', event)">Substract</button>
      </div>
    `;
  }
}

let views = {
  counters: Counters,
  counter: Counter
};


window.addEventListener('hashchange', e => {
  onRouteChange(getViewName(e.newURL));
});

window.addEventListener('load', e => {
  onRouteChange(getViewName(document.location.hash));
});

function getViewName(url) {
  return url.split('#')[1] || DEFAULT_VIEW;
}

function setState(view, state) {
  view.state = state;
  onRouteChange(getViewName(document.location.hash));
}

function action(id, actionName, event) {
  let view = findById(root, id);
  view[actionName](event);
  onRouteChange(getViewName(document.location.hash));
}

function findById(root, id) {
  if (root.id === id) {
    return root;
  }
  if (root.children) {
    let view;
    for (let child of root.children) {
      view = findById(child, id);
      if (view) {
        return view;
      }
    }
  }
}

function render(view, props) {
  view.props = props;
  return view.render(props);
}

let root;

function onRouteChange(viewName) {
  let view = views[viewName];
  if (!root) {
    root = new view();
  }
  let main = document.querySelector('main');
  main.innerHTML = render(root);
}