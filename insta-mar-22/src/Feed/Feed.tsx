import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { UserInfoContext } from '..';
import {Post} from '../Post';

async function getJSON(url: string) {
  const res = await fetch(url);
  return res.json();
}

function Button({children}: {children: JSX.Element | string | ReactNode}) {
  return <button style={ {
    backgroundColor: 'transparent',
    border: '2px solid'
  } }>{children}</button>
}

function Box({children}: {children: JSX.Element | string}) {
  return <div style={ {
    border: '2px solid pink'
  } }>
    {children}
  </div>
}

type FlexDirection = 'column' | 'row';

function Flex({children, dir}: {children: JSX.Element[], dir?: FlexDirection}) {
  return <div style={ {
    display: 'flex',
    flexDirection: dir || 'row'
  } }>
    {children}
  </div>
}

function List({children}: {children: JSX.Element[]}) {
  return <ul style={ {
    listStyleType: 'none',
    padding: 0,
    margin: '0 auto',
    border: '1px solid',
    maxWidth: '80%',
  } }>
    {children.map((child, i) => <li key={i} style={{
      border: '1px solid',
      marginBottom: '1em'
    }}>{child}</li>)}
  </ul>;
}

function NewPost() {
  return <Box>
    <form action='http://localhost:5000/posts' method='POST' encType="multipart/form-data">
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id='title' name='title' />
      </div>
      <div>
        <label htmlFor="img">Image</label>
        <input type="file" name="img" id="img" />
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  </Box>;
}

export default function Feed() {
  const [posts, setPosts] = useState([{id: '', title: 'initial state'}])
  const [page, setCount] = useState(0);
  const [isRow, toggleRow] = useState(true);

  const userInfoContext = useContext(UserInfoContext);

  useEffect(() => {
    async function setData() {
      setPosts(await getJSON(`./data/posts.json?page=${page}`));
    }
    setData();
  }, [page]);

  return <div>
    <NewPost></NewPost>
    <h2>The user is {userInfoContext.userInfo.email}</h2>
    <List>
      {posts.map((post, i) => <Post key={i} post={post}></Post>)}
    </List>
  </div>
}