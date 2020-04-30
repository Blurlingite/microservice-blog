import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

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

interface PostObjectOfObjects {
  [id: string]: Post;
}

const posts: PostObjectOfObjects = {};

// get all posts
app.get("/posts", (req, res) => {
  res.send(posts);
});

// receive events from event bus
app.post("/events", (req, res) => {
  const { type, data } = req.body;
  if (type === "PostCreated") {
    // take out post info from incoming event and add it to the posts object in this file
    const { id, title } = data;
    posts[id] = { id, title, comments: [] }; // initialize comments to empty array when post is first created, that way we can add comments to this post
  }

  if (type === "CommentCreated") {
    // Notice, what we take out from data is what was sent in comments' index.ts when we posted to event bus' url ("http://localhost:4005/events")
    const { id, content, postId, status } = data;

    // find post
    const rightPost = posts[postId];
    // add comment to post
    const commentToAdd: Comment = { id, content, status };
    rightPost.comments.push(commentToAdd);
  }

  if (type === "CommentUpdated") {
    console.log("Data:" + data);

    const { id, content, postId, status } = data;
    // find comment
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      // return the comment if it matches the id
      return comment.id === id;
    });

    // since "CommentUpdated" is a generic event, we don't know what changed, so let's reassign other relevant fields of this comment with the incoming data
    if (comment) {
      comment.status = status;
      comment.content = content;
    }
  }

  console.log(posts);
  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
