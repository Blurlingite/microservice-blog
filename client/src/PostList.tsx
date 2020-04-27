import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

interface Post {
  id: string;
  title: string;
}
export default () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/posts");

    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts).map((post) => {
    // prevent unknown type
    const somePost: Post = post as Post;

    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={somePost.id}
      >
        <div className="card-body">
          <h3>{somePost.title}</h3>
          <CommentList postId={somePost.id} />
          <CommentCreate postId={somePost.id} />
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedPosts}
    </div>
  );
};
