import React from 'react';
import ReactDOM from 'react-dom/client';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

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

function UserInfo({userId, userInfo, isOpen}) {
  return (
    <div className='info' hidden={isOpen === false ? true : null}>
      {userInfo.todos ?
        <Todos userId={userId} todos={userInfo.todos}></Todos> :
        userInfo}
    </div>
  );
}

function User(user) {
  const [isOpen, setOpen] = React.useState(false);
  const [info, setInfo] = React.useState(null);
  return (
    <div key={user.id} className='profile' onClick={async (e) => {
      if (!info) {
        setOpen(true);
        setInfo('Loading...');
        const todos = await get(`todos?userId=${user.id}`);
        setInfo({todos});
      }
      setOpen(!isOpen);
    }
  }>
      <span>{user.name}</span>
      <p>
        <img height='50' src={`https://avatars.dicebear.com/api/personas/${user.username}.svg`} alt=''></img>
      </p>
      <dl>
        <dt>Phone</dt>
        <dd>{user.phone}</dd>
        <dt>City</dt>
        <dd>{user.address.city}</dd>
      </dl>
      {info ? <UserInfo isOpen={isOpen} userInfo={info} userId={user.id}></UserInfo> : null}
    </div>
  )
}

function Todos({userId, todos}) {
  return (
    <ul>
      {todos.map((todo, i) => (
        <li key={`check_${userId}_${i}`}>
          <input type={'checkbox'} readOnly={true} checked={todo.completed ? true : null}></input>
          <span>{todo.title}</span>
        </li>
      ))}
    </ul>
  )
}

function Users({users}) {
  return (
    <div className='list'>
      {users.map(u => User(u))}
    </div>
  )
}

const root = ReactDOM.createRoot(qs('#root'));

async function main() {
  root.render((<div>Loading...</div>));
  root.render(
    <React.StrictMode>
      <Users users={await get('users')}></Users>
    </React.StrictMode>
  );
}

main();