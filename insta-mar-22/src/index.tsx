import React from 'react';
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
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={<App></App>}>
          <Route path='feed' element={<Feed></Feed>}></Route>
          <Route path='posts/:postId' element={<PostContainer></PostContainer>}></Route>
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
