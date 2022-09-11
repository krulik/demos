import React from 'react';
import { Link } from "react-router-dom";

function Header({children}: {children: JSX.Element}) {
  return <header style={{
    border: '1px solid',
    backgroundColor: 'white'
  }}>
    Hello
    <nav>
      <ul>
        <li><Link to={'/feed'}>Feed</Link></li>
        <li><Link to={'/user'}>User</Link></li>
      </ul>
      Message: {children}
    </nav>
  </header>;
}

export {Header};
