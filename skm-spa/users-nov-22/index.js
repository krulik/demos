function User(props) {
  return `
    <div class="User">
      ${Avatar(props)}
      ${UserDetails(props)}
      <p><button data-user-id="${props.id}">See more</button></p>
      <div ${props.isLoading ? '' : 'hidden'}>
        Loading...
      </div>
      ${props.todos ? `
        <ul class="Todos">
          ${props.todos.map(todo => `
            <li>${Todo(todo)}</li>
          `).join('')}
        </ul>
      ` : ''}
    </div>
  `;
}

function Avatar(props) {
  return `<img height="150" src="https://avatars.dicebear.com/api/adventurer/${props.name}.svg">`;
}

function UserDetails(props) {
  return `
    <dl>
      <div>
        <dt>Name</dt>
        <dd>${props.name}</dd>
      </div>
      <div>
        <dt>Username</dt>
        <dd>${props.username}</dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>${props.email}</dd>
      </div>
    </dl>
  `;
}

function Todo(props) {
  return `
    <input id="todo-${props.id}" type="checkbox" ${props.completed ? 'checked' : ''} />
    <label for="todo-${props.id}">${props.title}</label>
  `;
}

function UsersList(props) {
  return `
    <ul class="Users">
      ${props.users.map(user => `
        <li>
          ${User(user)}
        </li>
      `).join('')}
    </ul>
  `;
}

document.addEventListener('click', (e) => {
  const {userId} = e.target.dataset;
  if (!userId) {
    return;
  }

  actions.openUser(userId);
});

let actions = {
  openUser(userId) {
    let user = state.users.find(user => user.id === Number(userId));
    user.isLoading = true;
    setState({users: state.users});

    fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
      .then(response => response.json())
      .then(todos => {
          user.isLoading = false;
          user.todos = todos;
          setState({users: state.users});
      });
  }
}

function setState(newState) {
  state = {...state, ...newState};
  render(state);
}

function render(state) {
  document.querySelector('#root').innerHTML = App(state);
}

function App(state) {
  return `
    <h1>Welcome to JSBook! 🤖</h1>

    <h2>These are the latest users</h2>

    ${UsersList({users: state.users})}
  `;
}

let state = {
  users: []
};

fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(users => {
    setState({users});
  });

