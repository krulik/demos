import './App.css';
import { useState } from 'react';

function User({ user }) {
  return (
    <div class="User">
      <Avatar name={user.name}></Avatar>

      <UserDetails user={user}></UserDetails>
      <p><button>See more</button></p>
      <TodoList todos={user.todos}></TodoList>
    </div>
  );
}

function TodoList({ todos }) {
  return (
    <ul class="Todos">
      {todos.map(todo => (
        <li>
          <Todo todo={todo}></Todo>
        </li>
      ))}
    </ul>
  );
}

function Todo({ todo }) {

  return (
    <>
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        defaultChecked={todo.completed} />

      <label for={`todo-${todo.id}`}>{todo.title}</label>
    </>
  );
}

function SmartTodo({ todo }) {

  const [isChecked, setIsChecked] = useState(todo.completed);

  return (
    <>
      <input
        id={`todo-${todo.id}`}
        type="checkbox"
        checked={isChecked}
        onChange={(e) => {setIsChecked(!isChecked)}} />

      <label for={`todo-${todo.id}`}>{todo.title}</label>
    </>
  );
}

function Avatar({ name }) {
  return (
    <img height="150" alt="" src={`https://avatars.dicebear.com/api/adventurer/${name}.svg`} />
  );
}

function UserDetails({ user }) {
  return (
    <dl>
      <div>
        <dt>Name</dt>
        <dd>{user.name}</dd>
      </div>
      <div>
        <dt>Username</dt>
        <dd>{user.username}</dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>{user.email}</dd>
      </div>
    </dl>
  );
}

function UsersList({ users }) {
  return (
    <ul class="Users">
      {users.map(user => (
        <li>
          <User user={user}></User>
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <>
      <h1>Welcome to JSBook! 🤖</h1>
      <h2>These are the latest users</h2>

      <UsersList users={state.users} />
    </>
  );
}

const state = {
  users: [
    {
      name: 'John', username: 'jlennon', email: 'jlennon@beatles.com', todos: [
        { id: '', title: 'Todo 1', completed: true }, { id: '', title: 'Todo 2', completed: false }, { id: '', title: 'Todo 3', completed: true }
      ]
    },
    {
      name: 'Paul', username: 'pmccartney', email: 'pmccartney@beatles.com', todos: [
        { id: '', title: 'Todo 1', completed: true }, { id: '', title: 'Todo 2', completed: false }, { id: '', title: 'Todo 3', completed: true }
      ]
    },
    {
      name: 'George', username: 'gharrison', email: 'gharrison@beatles.com', todos: [
        { id: '', title: 'Todo 1', completed: true }, { id: '', title: 'Todo 2', completed: false }, { id: '', title: 'Todo 3', completed: true }
      ]
    },
    {
      name: 'Ringo', username: 'rstarr', email: 'rstarr@beatles.com', todos: [
        { id: '', title: 'Todo 1', completed: true }, { id: '', title: 'Todo 2', completed: false }, { id: '', title: 'Todo 3', completed: true }
      ]
    }
  ]
}

export default App;
