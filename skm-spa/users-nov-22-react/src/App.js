import './App.css';
import { createContext, useContext, useEffect, useReducer, useState } from 'react';

function Balance({ value, onWithdraw, onDeposit }) {

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
      <button onClick={(e) => onDeposit(amount)}>Deposit</button>
    </div>
  );
}

function User({ userId, userBalance }) {

  let [todos, setTodos] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [user, setUser] = useState({});
  let dispatch = useContext(FamilyBalanceDispatch);

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

      <Balance
        value={userBalance}
        onWithdraw={(amount) => dispatch({
          type: 'withdraw',
          amount,
          userName: user.name
        })}
        onDeposit={(amount) => dispatch({
          type: 'deposit',
          amount,
          userName: user.name
        })}></Balance>

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

let FamilyBalanceContext = createContext(null);
let FamilyBalanceDispatch = createContext(null);

function FamilyBalance() {
  let [state, dispatch] = useReducer(familyBalanceReducer, initialState);
  let {familyBalance, users} = state.data;
  let {info, success, error} = state.ui;

  let balanceMap = getBalanceMap(familyBalance, users);

  return (
    <FamilyBalanceContext.Provider value={state}>
      <FamilyBalanceDispatch.Provider value={dispatch}>

        <p>Family balance is <b>{familyBalance}</b> 💰</p>
        {error ? <p style={{color: 'red'}}>{error}! 👮</p> : null}
        {success ? <p style={{color: 'green'}}>{success} 🍾</p> : null}
        {info ? <p style={{color: 'blue'}}>{info} ✍️</p> : null}

        <UsersList users={users} balanceMap={balanceMap}></UsersList>

      </FamilyBalanceDispatch.Provider>
    </FamilyBalanceContext.Provider>
  )
}

function UsersList({users, balanceMap}) {
  return (
    <>
      <ul className="Users">
        {users.map(user => (
          <li key={user.id}>
            <User userId={user.id} userBalance={balanceMap[user.id]}>
            </User>
          </li>
        ))}
      </ul>
    </>
  );
}

function familyBalanceReducer(previousState, action) {
  switch (action.type) {
    case 'withdraw': {
      let {familyBalance, users} = previousState.data;
      let {amount, userName} = action;
      let newBalance = familyBalance - amount;
      let perPerson = getBalancePerPerson(newBalance, users);
      let max = getMaxWithdraw(familyBalance, users);
      if (perPerson < 1) {
        return {
          ...previousState, ...({
            ui: {
              info: '',
              success: '',
              error: `${userName} can't withdraw more than ${max} (tried ${amount})`
            }
          })
        };
      }
      return {
        ...previousState, ...({
        data: {
          users,
          familyBalance: newBalance
        },
        ui: {
          info: `${userName} withdrawn ${amount}`,
          success: '',
          error: ''
        }
      })};
    }
    case 'deposit': {
      let {familyBalance, users} = previousState.data;
      let {amount, userName} = action;
      let newBalance = familyBalance + amount;
      return {
        ...previousState, ...({
        data: {
          users,
          familyBalance: newBalance
        },
        ui: {
          info: '',
          success: `${userName} had deposited ${amount}!`,
          error: ''
        }
      })};
    }
    default: {
      throw Error(`Invalid action ${action.type}`);
    }
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

      <FamilyBalance></FamilyBalance>
    </>
  );
}

const initialState = {
  data: {
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
    ],
    familyBalance: 42
  },
  ui: {
    error: '',
    success: '',
    info: ''
  }
}

export default App;
