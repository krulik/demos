import React, { Suspense, createContext, useContext, useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Outlet, RouterProvider, createBrowserRouter, Link, useNavigate, Navigate, useLocation, Await, defer, useLoaderData, Form } from 'react-router-dom';
import ErrorPage from './routes/ErrorPage';

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
    if (response.status >= 400) {
      throw response; // handle error upstream
    }
    if (response.status >= 300) {
      return response;
    }
    if (response.status <= 201) {
      return response.json();
    }
    return {ok: response.status === 204};
  });
}

async function serverAuthenticate(email) {
  if (email) {
    const {csrfToken} = await sendJson('GET', '/csrf');
    await sendJson('POST', '/login', {email}, csrfToken);
  }
  return sendJson('GET', '/users/me');
}

const AuthContext = createContext();

function AuthProvider({children, userData}) {
  const [user, setUser] = useState(userData);
  const contextValue = {
    user,
    async logout() {
      await sendJson('POST', '/logout');
      setUser(null);
    },
    isAuth() {
      return user !== null;
    }
  }
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

function AuthLayout() {
  const {userPromise} = useLoaderData();
  return (
    <Suspense fallback={'not loaded'}>
      <Await
        resolve={userPromise}
        errorElement={'error in suspense'}
        children={(user) => (
          <AuthProvider userData={user}>
            <AppBar></AppBar>
            <Outlet></Outlet>
          </AuthProvider>
        )}
        />
    </Suspense>
  )
}
AuthLayout.loader = () => {
  return defer({userPromise: new Promise(async (resolve, reject) => {
    try {
      resolve(await serverAuthenticate());
    } catch (err) {
      console.log(err);
      if (err.status === 401) {
        return resolve(null);
      }
      return reject(err);
    }
  })});
}

function ProtectedRoute() {
  const auth = useContext(AuthContext);
  const location = useLocation();
  if (!auth.isAuth() && location.pathname !== '/login') {
    return <Navigate to={'/login'} />
  }
  if (auth.isAuth() && location.pathname !== '/feed') {
    return <Navigate to={'/feed'} />
  }
  return (
    <Outlet />
  )
}

function AppBar() {
  const auth = useContext(AuthContext);
  return (
    <header>
      <div>
        <p>{JSON.stringify(auth)}</p>
        <p>{auth.message}</p>
      </div>
      <p>hello {String(auth.user?.name)}</p>
      <nav>
        <ul>
          <li><Link to={'/'}>Feed</Link></li>
          <li><Link to={'/profile'}>Profile</Link></li>
          <li><Link to={'/login'}>Login</Link></li>
        </ul>
        <button onClick={() => {
          auth.logout();
          }}>logout</button>
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
  );
}
LoginPage.action = async ({params, request}) => {
  let formData = await request.formData();
  return serverAuthenticate(formData.get('email'));
}

function Feed() {
  const posts = useLoaderData();
  return (
    <div>
      Here comes the Feed (isLoading: {false})
      {posts && posts.map((post, index) => <div key={index}>
        {post.title}: {post.text}
        <Like></Like>
      </div>)}
    </div>
  )
}
Feed.loader = async () => {
  return sendJson('GET', '/feed');
}

function Like() {
  const data = useLoaderData();
  return (
    <p>
      isLoading {false}
      data {data?.text}
      <button onClick={(e) => {
        sendJson('POST', '/like')
        }}>Like</button>
    </p>
  )
}

function Profile() {
  const auth = useContext(AuthContext);
  return (
    <p>
      user details:
      {JSON.stringify(auth.user)}
    </p>
  )
}

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    loader: AuthLayout.loader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            path: '/login',
            element: <LoginPage />,
            action: LoginPage.action
          },
          {
            path: '/feed',
            element: <Feed />,
            loader: Feed.loader
          },
          {
            path: '/profile',
            element: <Profile />
          }
        ]
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
