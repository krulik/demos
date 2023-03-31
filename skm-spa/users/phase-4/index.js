const BASE_URL = 'https://jsonplaceholder.typicode.com';

const users = {};

async function get(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    return await res.json();
  } catch (err) {
    handleError(err);
  }
}

function handleError(err) {
  alert(`Sorry, something happened [err=${err}]`);
}

function qs(selector) {
  return document.querySelector(selector);
}

function renderUser(user) {
  let div = document.createElement('div');
  div.classList.add('profile')
  div.innerHTML = `
    <span>${user.name}</span>
    <p><img height="50" src="https://avatars.dicebear.com/api/personas/${user.username}.svg"></p>
    <dl>
      <dt>Phone</dt>
      <dd>${user.phone}</dd>
      <dt>City</dt>
      <dd>${user.address.city}</dd>
    </dl>
  `;
  div.addEventListener('click', async e => {
    const todos = await get(`todos?userId=${user.id}`);
    div.append(renderTodos(todos));
  });
  return div;
}

function renderTodos(todos) {
  const ul = document.createElement('ul');
  ul.innerHTML = todos.map(todo => `
    <li>
      <input type="checkbox" ${todo.completed ? 'checked' : ''}>
      <span>${todo.title}</span>
    </li>
  `).join('');
  return ;
}

function render(users) {
  qs('#root').append(...users.map(u => renderUser(u)));
}

render(await get('users'))