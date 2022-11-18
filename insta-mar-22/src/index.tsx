import React, { createContext, ReactNode, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, Routes, HashRouter } from "react-router-dom";
import Feed from './Feed/Feed';
import {PostContainer} from './Post';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

interface UserInfoType {
  userName: string;
  email: string;
}

interface UserInfoContextType {
  userInfo: UserInfoType;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType>>;
}

export const UserInfoContext = createContext<UserInfoContextType>({
  userInfo: {
    userName: '',
    email: ''
  },
  setUserInfo: () => {}
});


export const ConfigContext = createContext({
  apiUrl: process.env.API_URL,
  blababa: 'adsasdsad'
})

function UserContextWrapper({children}: {children: ReactNode}) {
  const [userInfo, setUserInfo] = useState<UserInfoType>({
    userName: '',
    email: ''
  });

  let contextValue = {
    userInfo,
    setUserInfo
  };

  return <>
    <UserInfoContext.Provider value={contextValue}>
      {children}
    </UserInfoContext.Provider>
  </>;
}

root.render(
  <React.StrictMode>
    <UserContextWrapper>
      <HashRouter>
        <Routes>
          <Route path='/' element={<App></App>}>
            <Route path='feed' element={<Feed></Feed>}></Route>
            <Route path='posts/:postId' element={<PostContainer></PostContainer>}></Route>
          </Route>
        </Routes>
      </HashRouter>
    </UserContextWrapper>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
