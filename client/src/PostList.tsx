import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

interface Comment {
  id: string;
  content: string;
  status: string;
}

interface Post {
  id: string;
  title: string;
  comments: Comment[];
}
export default () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    // get posts from query service and NOT posts service
    // Notice that this alone won't stop the app from reaching out to the comments service to get the comments for each post. (If you check the "Network" tab in Chrome console, you will still see a request to comments)
    // So, we also needed to change CommentList by stopping it from sending an axios request and just pass in the comments for it to display
    const res = await axios.get("http://localhost:4002/posts");
    console.log(res.data);
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
          <CommentList comments={somePost.comments} />
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
