import React from 'react';
import './App.css';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

function App() {
  const {isLoading, data} = useQuery({
    queryKey: ['myUser'],
    queryFn: () => {
      return fetch('/users/me').then(res => res.json())
    }
  })

  return (
    <div>
      <p>
        Static content
      </p>
      {
        isLoading ? <p>still fetching...</p> :
        <p>
          <Link to={`/users/${data.id}`}>userName={data.userName}</Link>
        </p>
      }
      <p>
        <Link to={'/lazy'}>Go to lazy page</Link>
      </p>
    </div>
  )
}

export default App;
