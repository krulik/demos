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

function renderInfo({userId, userInfo, isOpen}) {
  return el('div', {
    hidden: isOpen === false
  }, typeof userInfo === 'string' ? userInfo : renderTodos({userId, todos: userInfo.todos}))
}

function renderUser(user) {
  const [isOpen, setOpen] = React.useState(false);
  const [info, setInfo] = React.useState(null);
  return el('div', {
    className: 'profile',
    onClick: async (e) => {
      if (!info) {
        setOpen(true);
        setInfo('Loading...');
        const todos = await get(`todos?userId=${user.id}`);
        setInfo({todos});
      }
      setOpen(!isOpen);
    }
  }, [
    el('span', {key: `name_${user.id}`}, `${user.name}`),
    el('p', {key: `img_${user.id}`}, el('img', {
      height: 50,
      src: `https://avatars.dicebear.com/api/personas/${user.username}.svg`
    }, null)),
    el('dl', {key: `details_${user.id}`}, [
      el('dt', {key: `phone_dt_${user.id}`}, `Phone`),
      el('dd', {key: `phone_dd_${user.id}`}, `${user.phone}`),
      el('dt', {key: `city_dt_${user.id}`}, `City`),
      el('dd', {key: `city_dd_${user.id}`}, `${user.address.city}`)
    ]),
    info ? el(renderInfo, {
      key: `info_${user.id}`,
      className: 'info',
      userInfo: info,
      isOpen
    }, []) : null
  ]);
}

function renderTodos({userId, todos}) {
  return el('ul', {}, todos.map((todo, i) => el('li', {
    key: `todo_${userId}_${i}`
  }, [
    el('input', {
      key: `check_${userId}_${i}`,
      type: 'checkbox',
      readOnly: true,
      ...(todo.completed ? {checked: true} : {})
    }, null),
    el('span', {
      key: `check_title_${userId}_${i}`
    }, `${todo.title}`)
  ])));
}

function renderUsers({users}) {
  return el('div', {className: 'list'}, ...users.map(u => renderUser(u)));
}

const el = React.createElement;

const root = ReactDOM.createRoot(qs('#root'));
root.render(el('div', {}, 'Loading...'));
root.render(el(renderUsers, {users: await get('users')}, null));