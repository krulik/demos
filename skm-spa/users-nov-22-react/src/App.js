import './App.css';
import { useEffect, useState } from 'react';

function Counter({ counter, onIncrease }) {

  let [step, setStep] = useState(1);

  return (
    <div style={{ border: '1px solid' }}>
      <p>Counter is {counter}</p>
      <p>
        <input type='number' value={step} onChange={(e) => {
          setStep(Number(e.target.value));
        }} />
      </p>
      <button onClick={(e) => onIncrease(step)}>Increase</button>
    </div>
  );
}

function User({ userId, counter, onIncrease }) {

  let [todos, setTodos] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [user, setUser] = useState({});

  useEffect(() => {
    let didEffect = false;

    console.log(`useEffect for userId=${userId}`);
    fetch(`https://jsonplaceholder.typicode.com/users?id=${userId}`)
      .then(res => res.json())
      .then(([data]) => {
        if (!didEffect) {
          setUser(data);
        }
      });

    return () => {
      // cleanup before next effect or on component destroy (unmount)
      didEffect = true;
      console.clear();
    }

  }, [userId]);

  return (
    <div className="User">
      <Avatar name={user.name}></Avatar>

      <Counter counter={counter} onIncrease={onIncrease}></Counter>

      <UserDetails user={user}></UserDetails>
      <p><button onClick={() => {
        setIsLoading(true);

        fetch(`https://jsonplaceholder.typicode.com/todos?userId=${user.id}`)
          .then(res => res.json())
          .then(data => {
            setTodos(data);
            setIsLoading(false);
          });
      }}>See more</button></p>

      <div>
        {isLoading ?
          <p>Loading...</p> : (
          todos.length ?
            <TodoList todos={todos}></TodoList> :
            null
          )
        }
      </div>
    </div>
  );
}

function UsersList({ users }) {
  let [counter, setCounter] = useState(42);

  return (
    <ul className="Users">
      {users.map(user => (
        <li key={user.id}>
          <User userId={user.id} counter={counter} onIncrease={(step) => {
            if (Number(user.id) % 2 !== 0) {
              console.log('Odd users cant increase counter');
              return;
            }
            setCounter(counter + step);
          }}></User>
        </li>
      ))}
    </ul>
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
      id: '1'
    },
    {
      id: '2'
    },
    {
      id: '3'
    },
    {
      id: '4'
    }
  ]
}

export default App;
