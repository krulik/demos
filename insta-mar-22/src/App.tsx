import React from 'react';
import { Link, Outlet } from "react-router-dom";

function App() {
  return <div>
    Hello
    <nav>
      <ul>
        <li><Link to={'/feed'}>Feed</Link></li>
        <li><Link to={'/user'}>User</Link></li>
      </ul>
    </nav>
    <Outlet></Outlet>
  </div>;
}

export default App;
