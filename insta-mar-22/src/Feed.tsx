import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import Post from './Post';

async function getJSON(url: string) {
  const res = await fetch(url);
  return res.json();
}

export default function Feed() {
  const [posts, setPosts] = useState([{id: '', title: 'initial state'}])
  const [page, setCount] = useState(0);

  useEffect(() => {
    async function setData() {
      setPosts(await getJSON(`./data/posts.json?page=${page}`));
    }
    setData();
  }, [page])

  useEffect(() => {
    console.log('render Feed');
  })

  return <div>
    <ul>
      {posts.map((post, i) => <li key={i}>
        <Post post={post}></Post>
      </li>)}
    </ul>
    <p>
      <button onClick={() => setCount(page + 1)}>Page {page}</button>
    </p>
  </div>
}