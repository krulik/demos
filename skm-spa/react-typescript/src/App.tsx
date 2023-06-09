import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

interface CardProps {
  children: React.ReactNode;
  borderType: 'dashed' | 'solid';
}

interface CardState {
  isOpen: boolean;
}

function Card({children, borderType}: CardProps) {
  const [state, setState] = useState<CardState>({isOpen: true});
  return (
    <div style={{border: `1px ${borderType}`, padding: '0.5em'}}>
      I'm a card, this is my child
      {state.isOpen ? <p>
        {children}
      </p> : null}
      <p>
        <button onClick={(e) => {
          setState((prevState) => ({
            isOpen: !prevState.isOpen
          }))
        }}>toggle</button>
      </p>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <Card borderType={'dashed'}>
          Dynamic content
        </Card>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
