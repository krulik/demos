import './App.css';
import { useEffect, useState } from 'react';

function Balance({ value, onWithdraw }) {

  let [amount, setAmount] = useState(1);

  return (
    <div style={{ border: '1px solid' }}>
      <p>Balance is {value}</p>
      <p>
        <label htmlFor="amount">Withdraw amount: </label>
        <input id='amount' type='number' value={amount} onChange={(e) => {
          setAmount(Number(e.target.value));
        }} />
      </p>
      <button onClick={(e) => onWithdraw(amount)}>Withdraw</button>
    </div>
  );
}

function User({ userId, userBalance, onWithdraw }) {

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

      <Balance value={userBalance} onWithdraw={(amount) => onWithdraw(user, amount)}></Balance>

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

function getMaxWithdraw(familyBalance, users) {
  return familyBalance - users.length;
}

function getBalancePerPerson(familyBalance, users) {
  return familyBalance / users.length;
}

function getBalanceMap(familyBalance, users) {
  return users.reduce((balanceMap, user) => {
    balanceMap[user.id] = getBalancePerPerson(familyBalance, users);
    return balanceMap;
  }, {})
}

function UsersList({ users }) {
  let [familyBalance, setFamilyBalance] = useState(42);
  let [error, setIsError] = useState('');
  let balanceMap = getBalanceMap(familyBalance, users);

  return (
    <>
      <p>Family balance is <b>{familyBalance}</b> 💰</p>
      {error ? <p style={{color: 'red'}}>{error}! 👮</p> : null}
      <ul className="Users">
        {users.map(user => (
          <li key={user.id}>
            <User userId={user.id} userBalance={balanceMap[user.id]} onWithdraw={onWithdraw}></User>
          </li>
        ))}
      </ul>
    </>
  );

  function onWithdraw(user, amount) {
    let newBalance = familyBalance - amount;
    let perPerson = getBalancePerPerson(newBalance, users);
    let max = getMaxWithdraw(familyBalance, users);
    if (perPerson < 1) {
      setIsError(`${user.name} can't withdraw more than ${max} (tried ${amount})`);
      return;
    }
    setIsError('');
    setFamilyBalance(familyBalance - amount);
  }
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
      <h1>Welcome to Family Book! 👩‍👩‍👧‍👧</h1>
      <h2>These are the family members</h2>

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
