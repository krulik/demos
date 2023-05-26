import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Form, Navigate, Outlet, RouterProvider, createBrowserRouter, redirect, useActionData, useLocation, useLoaderData, Link, useFetcher } from 'react-router-dom';
import ErrorPage from './routes/ErrorPage';

// TODO
// users/me redundant?
// implement /logout
// programmatic is better?
// -> everything in one place and perhaps don't need AuthRoute?
// -> not really, better declarative

// inner re-route (from App to /feed)
// check APIs from downstream return 401 and redirect to login


// TODO 2
// 1. since going to /login invalidates user we're displaying
// null even when authenticated

// 2. actions/fetchers
// how to structure them normally?


function sendJson(method, path, body, csrf) {
  const BASE_URL = 'https://localhost:5000';
  const headers = {
    'Content-Type': 'application/json'
  };
  if (csrf) {
    headers['x-csrf-token'] = csrf;
  }
  return fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: JSON.stringify(body)
  }).then((response) => {
    if (response.status === 401) {
      return redirect('/login');
    }
    if (response.status > 204) {
      return response; // handle error upstream
    }
    if (response.status <= 201) {
      return response.json();
    }
    return {ok: response.status === 204};
  });
}

const AuthContext = createContext();

function AuthProvider() {
  const loaderData = useLoaderData();

  const contextValue = {
    user: loaderData
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <AppLayout />
    </AuthContext.Provider>
  )
}
AuthProvider.loader = ({ params, request }) => {
  if (request.url.endsWith('/login')) {
    return null;
  }
  return sendJson('GET', '/users/me');
}

function useAuth() {
  return useContext(AuthContext);
}

function AppLayout() {
  return (
    <>
      <AppBar></AppBar>
      <Outlet></Outlet>
    </>
  )
}

function AppBar() {
  const auth = useAuth();
  const location = useLocation();
  return (
    <header>
      <div>
        <p>{JSON.stringify(location)}</p>
        <p>{JSON.stringify(auth)}</p>
      </div>
      <p>hello {String(auth.user?.name)}</p>
      <nav>
        <ul>
          <li><Link to={'/'}>Feed</Link></li>
          <li><Link to={'/profile'}>Profile</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export function LoginPage() {
  return (
    <Form method='post'>
      <label htmlFor='email'>Login</label>
      <input type='email' name='email' id='email' />
      <button>Submit</button>
    </Form>
  )
}
LoginPage.action = async ({ params, request }) => {
  let formData = Object.fromEntries(await request.formData());
  const {csrfToken} = await sendJson('GET', '/csrf');
  const res = await sendJson(request.method, '/login', formData, csrfToken);
  if (res.ok) {
    return redirect('/');
  }
  throw res;
}

function Feed() {
  const posts = useLoaderData();
  const fetcher = useFetcher();
  return (
    <div>
      Here comes the Feed
      {posts.map((post, index) => <p key={index}>
        {post.title}: {post.text}
        <fetcher.Form method='post'>
          <button>Like</button>
        </fetcher.Form>
      </p>)}
    </div>
  )
}
Feed.loader = async ({request}) => {
  return sendJson('GET', '/feed');
}
Feed.action = async ({params, request}) => {
  debugger;
  return null;
}

function Profile() {
  const auth = useAuth();
  return (
    <p>
      user details:
      {JSON.stringify(auth.user)}
    </p>
  )
}
Profile.loader = () => {
  return sendJson('GET', '/users/me');
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthProvider />,
    loader: AuthProvider.loader,
    shouldRevalidate: ({ nextUrl, defaultShouldRevalidate }) => {
      if (nextUrl.pathname === '/login' ||
          nextUrl.pathname === '/profile') {
        console.log('revalidate', true);
        return true;
      }
      console.log('default revalidate', defaultShouldRevalidate);
      return defaultShouldRevalidate;
    },
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
        action: LoginPage.action
      },
      {
        index: true,
        element: <Feed />,
        loader: Feed.loader,
        action: Feed.action
      },
      {
        path: '/profile',
        element: <Profile />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
