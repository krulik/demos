import React, { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import { Header } from './Header/Header';

let isDev = false;

function App() {
  const realServerUrl = isDev ?
    'http://localhost:5000/docs' :
    'https://heroku-demo.onrender.com/docs';

  const [serverObject, setServerObject] = useState({_id: '', data: 0});

  useEffect(() => {
    async function fetchAndSet() {
      const res = await fetch(realServerUrl);
      const data = await res.json();
      setServerObject(data[0]);
    }

    fetchAndSet();
  }, [])

  return <div style={{
    backgroundColor: '#eee',
    height: '100vh'
  }}>
    <Header>
      <strong>{serverObject._id}</strong>
    </Header>
    <Outlet></Outlet>
  </div>;
}

export default App;
