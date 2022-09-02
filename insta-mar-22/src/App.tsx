import React from 'react';
import { Outlet } from "react-router-dom";
import { Header } from './Header/Header';

function App() {
  return <>
    <Header></Header>
    <Outlet></Outlet>
  </>;
}

export default App;
