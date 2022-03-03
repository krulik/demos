let state = {
  favoriteFood: [],
  time: new Date()
};

class App {

  constructor() {
    console.log('constructor');
    this.timer = null;
  }

  async componentDidMount() {
    console.log('componentDidMount');
    const data = await this.getData();
    const newState = {
      favoriteFood: [
        ...state.favoriteFood,
        ...data
      ]
    }
    setState(newState);
    this.tick();
  }

  tick() {
    this.timer = setTimeout(() => {
      setState({time: new Date()});
      this.tick();
    }, 1000);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    clearTimeout(this.timer);
  }

  componentDidUpdate(prevState) {
    console.log('componentDidUpdate:', prevState, state);
  }

  getData() {
    return Promise.resolve([
      'malfuf',
      'tabule',
      'hamutzim'
    ]);
  }

  render(state) {
    console.log('render');
    const numPizzas = state.favoriteFood.filter(f => f === 'pizza');
    return `
      ${Header('Hello React')}
      <p>${state.time}</p>
      <p>
        <button onclick="addPizza()">Add Pizza</button>
        <span>num pizzas: ${numPizzas.length}</span>
      </p>
      ${List(state.favoriteFood)}
  `;
  }
}

function addPizza() {
  let newState = {
    favoriteFood: [
      ...state.favoriteFood,
      'pizza'
    ]
  };
  setState(newState);
}

function List(items) {
  return `
    <ul>
      ${items.map(item => {
    return `<li>${item}</li>`;
  }).join('')}
    </ul>
  `;
}

function Header(text) {
  return `
    <header>
      <h1>${text}</h1>
    </header>
  `;
}



// ---------------- Framework Code -------------------

let appRoot = null;

function setState(newState) {
  const prevState = {...state};
  state = {...state, ...newState};
  appRoot.componentDidUpdate(prevState);
  render(state);
}

function render(state) {
  appRoot = new App();
  appRoot.componentWillUnmount();
  document.querySelector('#root').innerHTML = appRoot.render(state);
  if (!App.__isMounted) {
    appRoot.componentDidMount();
    App.__isMounted = true;
  }
}

render(state);