import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

interface Comment {
  id: string;
  content: string;
  status: string;
}
interface CommentsByPostId {
  [id: string]: Comment[];
}

const commentsByPostId: CommentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id, // also send along ID of post to know which post this comment belongs to
      status: "pending",
    },
  });
  res.status(201).send(comments);
});

// this post goes to the event bus' endpoint
app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;

    // find comment already stored here and update it's status property
    // first get the array of comments with postId, then get the single comment with the comment's id
    const comments = commentsByPostId[postId];
    const commentToUpdate = comments.find((comment) => {
      return comment.id === id;
    });

    if (commentToUpdate) {
      commentToUpdate.status = status;
    }

    console.log("The ID is: " + id);

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      id,
      status,
      postId,
      content,
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
