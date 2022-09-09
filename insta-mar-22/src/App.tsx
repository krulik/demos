import React from 'react';
import { Outlet } from "react-router-dom";
import { Header } from './Header/Header';

function App() {
  return <div style={{
    backgroundColor: '#eee',
    height: '100vh'
  }}>
    <Header></Header>
    <Outlet></Outlet>
  </div>;
}

export default App;
