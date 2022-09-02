import React from 'react';
import { Link } from "react-router-dom";

function Header() {
  return <header>
    Hello
    <nav>
      <ul>
        <li><Link to={'/feed'}>Feed</Link></li>
        <li><Link to={'/user'}>User</Link></li>
      </ul>
    </nav>
  </header>;
}

export {Header};
