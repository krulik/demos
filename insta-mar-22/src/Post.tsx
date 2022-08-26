import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";

async function getJSON(url: string) {
  const res = await fetch(url);
  return res.json();
}

interface IPost {
  id: string;
  title: string;
}

export default function Post({post}: {post?: IPost}) {
  const [numLikes, addLike] = useState(0);
  const [dynamicPost, setDynamicPost] = useState({title: '', id: ''});
  const params = useParams();

  useEffect(() => {
    async function setDynamicData() {
      setDynamicPost(await getJSON(`./data/post.${params.postId}.json`))
    }
    if (!post) {
      setDynamicData();
    }
  }, [params.postId, post]);

  return <div>
    <h2><Link to={`/posts/${post?.id}`}>{post?.title || dynamicPost?.title}</Link></h2>
    <p>Num likes {numLikes}</p>
    <Like onLike={() => addLike(numLikes + 1)}>
      <strong>Bla bla</strong>
    </Like>
  </div>
}

interface IPropsLike {
  onLike: () => void;
  children: JSX.Element;
}

function Like({onLike, children}: IPropsLike) {
  return <button onClick={onLike}>{children}</button>
}