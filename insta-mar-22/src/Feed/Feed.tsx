import React, { useEffect, useState } from 'react';
import {Post} from '../Post';
import './Feed.css';

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
  }, [page]);

  return <div className='Feed'>
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