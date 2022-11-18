import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from "react-router-dom";
import { ConfigContext, UserInfoContext } from '.';
import { Header } from './Header/Header';

console.log(process.env.NODE_ENV);

function App() {
  // const realServerUrl = process.env.REACT_APP_API_URL;
  const configContext = useContext(ConfigContext);
  // configContext.apiUrl

  const realServerUrl = 'http://localhost:5000';
  // const realServerUrl = 'http://my-app.ren der.com';

  const userContext = useContext(UserInfoContext);

  const [serverObject, setServerObject] = useState({
    _id: '',
    data: 0,
    mediaUrl: ''
  });

  useEffect(() => {
    async function fetchAndSet() {
      if (!realServerUrl) {
        return;
      }
      try {
        const res = await fetch(`${realServerUrl}/posts`, {
          credentials: 'include'
        });
        const data = await res.json();
        setServerObject(data[0]);
      } catch (err) {
        console.error('got error', err);
      }

    }

    async function login() {
      if (!realServerUrl) {
        return;
      }
      const res = await fetch(`${realServerUrl}/login`, {
        credentials: 'include'
      });
      const userInfo = await res.json();
      userContext.setUserInfo(userInfo);
    }

    login();
    fetchAndSet();
  }, [])

  return <div style={{
    backgroundColor: '#eee',
    height: '100vh'
  }}>

    <Header>
      <strong>Message: {serverObject._id}</strong>
      <img height={100} src={`${realServerUrl}/${serverObject.mediaUrl}`} alt='' />
    </Header>
    <Outlet></Outlet>
  </div>;
}

export default App;
