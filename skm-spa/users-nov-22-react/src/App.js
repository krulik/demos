import './App.css';
import { useState } from 'react';

function User({ user }) {
  return (
    <div className="User">
      <Avatar name={user.name}></Avatar>

      <UserDetails user={user}></UserDetails>
      <p><button>See more</button></p>
      <TodoList todos={user.todos}></TodoList>
    </div>
  );
}

function TodoList({ todos }) {
  return (
    <ul className="Todos">
      {todos.map(todo => (
        <li key={todo.id}>
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

      <label htmlFor={`todo-${todo.id}`}>{todo.title}</label>
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

      <label htmlFor={`todo-${todo.id}`}>{todo.title}</label>
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
    <ul className="Users">
      {users.map(user => (
        <li key={user.id}>
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
      id: '1', name: 'John', username: 'jlennon', email: 'jlennon@beatles.com', todos: [
        { id: '11', title: 'Todo 1', completed: true }, { id: '12', title: 'Todo 2', completed: false }, { id: '13', title: 'Todo 3', completed: true }
      ]
    },
    {
      id: '2', name: 'Paul', username: 'pmccartney', email: 'pmccartney@beatles.com', todos: [
        { id: '21', title: 'Todo 1', completed: true }, { id: '22', title: 'Todo 2', completed: false }, { id: '23', title: 'Todo 3', completed: true }
      ]
    },
    {
      id: '3', name: 'George', username: 'gharrison', email: 'gharrison@beatles.com', todos: [
        { id: '31', title: 'Todo 1', completed: true }, { id: '32', title: 'Todo 2', completed: false }, { id: '33', title: 'Todo 3', completed: true }
      ]
    },
    {
      id: '4', name: 'Ringo', username: 'rstarr', email: 'rstarr@beatles.com', todos: [
        { id: '41', title: 'Todo 1', completed: true }, { id: '42', title: 'Todo 2', completed: false }, { id: '43', title: 'Todo 3', completed: true }
      ]
    }
  ]
}

export default App;
