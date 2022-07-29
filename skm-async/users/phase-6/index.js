const BASE_URL = 'https://jsonplaceholder.typicode.com';

const users = {};

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function get(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    await wait(1000);
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
    <p class="info"></p>
  `;
  div.addEventListener('click', async e => {
    const info = div.querySelector('.info');
    if (user.isOpen) {
      info.setAttribute('hidden', true);
    } else {
      info.removeAttribute('hidden');
    }
    user.isOpen = !user.isOpen;
    if (!user.hasData) {
      info.textContent = 'Loading...';
      const todos = await get(`todos?userId=${user.id}`);
      info.replaceChildren(renderTodos(todos));
      user.hasData = true;
    }
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
  return ul;
}

function render(users) {
  qs('#root').replaceChildren(...users.map(u => renderUser(u)));
}

qs('#root').textContent = 'Loading...';
render(await get('users'))