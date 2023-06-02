import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
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
const AuthStates = {
  PENDING: 'PENDING',
  AUTHORIZED: 'AUTHORIZED',
  UNAUTHORIZED: 'UNAUTHORIZED'
};

const AuthActions = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_ERROR: 'AUTH_ERROR',
  LOG_OUT: 'LOG_OUT'
};

function authReducer(previousState, action) {
  switch (action.type) {
    case AuthActions.AUTH_START: {
      return {
        authState: AuthStates.PENDING,
        redirect: null,
        user: null,
        message: 'Pending login'
      };
    }
    case AuthActions.AUTH_SUCCESS: {
      return {
        authState: AuthStates.AUTHORIZED,
        redirect: '/feed',
        user: action.user,
        message: 'Login success'
      };
    }
    case AuthActions.AUTH_ERROR: {
      return {
        authState: AuthStates.UNAUTHORIZED,
        redirect: '/login',
        user: null,
        message: `Login error [${action.error?.statusText || action.error}]`
      };
    }
    case AuthActions.LOG_OUT: {
      return {
        authState: AuthStates.UNAUTHORIZED,
        redirect: '/login',
        user: null,
        message: 'User was logged out'
      };
    }
    default: {
      throw Error(`Invalid action ${action.type}`);
    }
  }
}

function AuthProvider() {
  const [state, dispatch] = useReducer(authReducer, {
    authState: AuthStates.UNAUTHORIZED,
    user: null,
    redirect: null,
    message: 'Initial state'
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (state.redirect) {
      navigate(state.redirect);
    }
  }, [navigate, state.redirect])

  useEffect(() => {
    authenticate();
  }, [])

  useEffect(() => {
    console.log('AuthProvider update', {
      message: state.message,
      authState: state.authState,
      redirect: state.redirect,
      user: state.user
    });
  }, [state.authState, state.message, state.redirect, state.user])

  async function authenticate({email} = {}) {
    dispatch({
      type: AuthActions.AUTH_START
    });
    try {
      if (email) {
        const {csrfToken} = await sendJson('GET', '/csrf');
        await sendJson('POST', '/login', {email}, csrfToken);
      }
      const userRes = await sendJson('GET', '/users/me');
      dispatch({
        type: AuthActions.AUTH_SUCCESS,
        user: userRes
      });
    } catch (err) {
      dispatch({
        type: AuthActions.AUTH_ERROR,
        error: err
      });
    }
  }
  async function logout() {
    sendJson('POST', '/logout');
    dispatch({
      type: AuthActions.LOG_OUT
    });
  }

  const contextValue = {
    user: state.user,
    authMessage: state.message,
    authenticate,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      <AppBar></AppBar>
      <Outlet></Outlet>
    </AuthContext.Provider>
  )
}

function autFetchReducer(previousState, action) {
  switch (action.type) {
    case 'FETCH_START': {
      return {
        isLoading: true,
        error: null,
        data: null,
        message: `Starting fetch [params=${JSON.stringify(action.params)}]`
      };
    }
    case 'FETCH_SUCCESS': {
      return {
        isLoading: false,
        error: null,
        data: action.data,
        message: `Fetch success [data=${JSON.stringify(action.data)}]`
      };
    }
    case 'FETCH_ERROR': {
      return {
        isLoading: false,
        error: action.error,
        data: null,
        message: `Fetch error [error=${action.error}]`
      };
    }
    default: {
      throw Error(`Unsupported action type [${action.type}]`);
    }
  }
}

function useAuthFetch(consumerName) {
  const [state, dispatch] = useReducer(autFetchReducer, {
    isLoading: false,
    error: null,
    data: null,
    message: `authFetch initial state [consumerName=${consumerName}]`
  });
  const [params, setParams] = useState({
    method: null, path: null, body: null, csrf: null
  });
  const auth = useContext(AuthContext);

  const {method, path, body, csrf} = params;

  useEffect(() => {
    let didCleanup = false;

    async function fetch() {
      dispatch({type: 'FETCH_START', params});
      try {
        const res = await sendJson(method, path, body, csrf);
        dispatch({type: 'FETCH_SUCCESS', data: res});
      } catch (err) {
        dispatch({type: 'FETCH_ERROR', error: err});
      }
    }

    if (!didCleanup && method && path) {
      fetch();
    }

    return () => {
      didCleanup = true;
    }
  }, [auth, body, csrf, method, params, path])

  useEffect(() => {
    if (state.error?.status === 401 || state.error?.status === 403) {
      auth.logout();
    }
  }, [auth, state.error?.status])

  useEffect(() => {
    console.log('fetch message update', {message: state.message})
  }, [state.message])

  return {...state, setParams};
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
  const auth = useContext(AuthContext);
  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      auth.authenticate({email: e.target.email.value});
      }}>
      <label htmlFor='email'>Login</label>
      <input type='email' name='email' id='email' />
      <button>Submit</button>
    </form>
  );
}

function Feed() {
  const {isLoading, data, setParams} = useAuthFetch('Feed');
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
  const {isLoading, data, setParams} = useAuthFetch('Like');
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
    path: '/',
    element: <AuthProvider />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/feed',
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
