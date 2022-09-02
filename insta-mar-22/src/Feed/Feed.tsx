import React, { ReactNode, useEffect, useState } from 'react';
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

function Box({children}: {children: JSX.Element}) {
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
    listStyleType: 'none'
  } }>
    {children.map((child, i) => <li key={i}>{child}</li>)}
  </ul>;
}

export default function Feed() {
  const [posts, setPosts] = useState([{id: '', title: 'initial state'}])
  const [page, setCount] = useState(0);
  const [isRow, toggleRow] = useState(true);

  useEffect(() => {
    async function setData() {
      setPosts(await getJSON(`./data/posts.json?page=${page}`));
    }
    setData();
  }, [page]);

  return <div>
    <List>
      {posts.map((post, i) => <Post key={i} post={post}></Post>)}
    </List>
    <div>
      <button onClick={() => toggleRow(!isRow)}>Change flex dir</button>
      <Flex dir={isRow ? 'row' : 'column'}>
        <Box>
          <p>hello</p>
        </Box>
        <Box>
          <p>hello</p>
        </Box>
        <Box>
          <p>hello</p>
        </Box>
      </Flex>
    </div>
  </div>
}