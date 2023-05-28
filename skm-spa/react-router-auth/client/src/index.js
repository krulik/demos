import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Outlet, RouterProvider, createBrowserRouter, Link, useNavigate } from 'react-router-dom';
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

const AuthContext = createContext();

function AuthProvider() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setFirstLoad(false);
  }, [])

  useEffect(() => {
    async function getUser() {
      if (!firstLoad && !isAuth) {
        setUser(null);
      }
      try {
        const res = await sendJson('GET', '/users/me');
        setUser(res);
      } catch (err) {
        navigate('/login');
      }
    }
    getUser();
  }, [firstLoad, isAuth, navigate])

  const contextValue = {
    user,
    async login({email}) {
      try {
        const {csrfToken} = await sendJson('GET', '/csrf');
        const res = await sendJson('POST', '/login', {email}, csrfToken);
        if (res.ok) {
          setIsAuth(true);
          navigate('/');
        }
      } catch (err) {
        console.warn(`Auth error ${err}`);
      }
    },
    async logout() {
      await sendJson('POST', '/logout');
      setIsAuth(false);
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <AppLayout />
    </AuthContext.Provider>
  )
}

function useAuth() {
  return useContext(AuthContext);
}

function useAuthFetch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [params, setParams] = useState({});
  const {method, path, body, csrf} = params;
  const auth = useAuth();
  useEffect(() => {
    let ignore = false;
    async function fetch() {
      setIsLoading(false);
      setError(null);
      setData(null);
      try {
        if (!ignore) {
          setIsLoading(true);
          const res = await sendJson(method, path, body, csrf);
          setData(res);
        }
      } catch (err) {
        setError(err);
        if (err.status === 401 || err.status === 403) {
          return auth.logout();
        }
      } finally {
        setIsLoading(false);
      }
      return () => {
        ignore = true;
      }
    }
    if (auth.isAuth) {
      fetch();
    }
  }, [auth, body, csrf, method, path])
  return {isLoading, error, data, setParams};
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
  return (
    <header>
      <div>
        <p>{JSON.stringify(auth)}</p>
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
  const auth = useAuth();
  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      auth.login({email: e.target.email.value});
      }}>
      <label htmlFor='email'>Login</label>
      <input type='email' name='email' id='email' />
      <button>Submit</button>
    </form>
  );
}

function Feed() {
  const {isLoading, data, setParams} = useAuthFetch();
  const posts = data;
  useEffect(() => {
    setParams({method: 'GET', path: '/feed'})
  }, [setParams])
  return (
    <div>
      Here comes the Feed (isLoading: {String(isLoading)})
      {posts && posts.map((post, index) => <div key={index}>
        {post.title}: {post.text}
        <Like></Like>
      </div>)}
    </div>
  )
}

function Like() {
  const {isLoading, data, setParams} = useAuthFetch();
  return (
    <p>
      isLoading {String(isLoading)}
      data {data?.text}
      <button onClick={(e) => {
        setParams({method: 'POST', path: '/like'})
        }}>Like</button>
    </p>
  )
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthProvider />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        index: true,
        element: <Feed />
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
