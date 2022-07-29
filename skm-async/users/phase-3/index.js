const BASE_URL = 'https://jsonplaceholder.typicode.com';

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
  return `
    <div>
      <span>${user.name}</span>
      <p><img height="50" src="https://avatars.dicebear.com/api/personas/${user.username}.svg"></p>
      <dl>
        <dt>Phone</dt>
        <dd>${user.phone}</dd>
        <dt>City</dt>
        <dd>${user.address.city}</dd>
      </dl>
    </div>
  `;
}

function render(users) {
  qs('#root').innerHTML = `
    <ul>
      ${users.map(u => `<li>${renderUser(u)}</li>`).join('')}
    </ul>
  `;
}


render(await get('users'))