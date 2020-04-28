import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

// const express = require("express");
// const bodyParser = require("body-parser");
// const { randomBytes } = require("crypto");
// const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

interface Comment {
  id: string;
  content: string;
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

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id, // also send along ID of post to know which post this comment belongs to
    },
  });
  res.status(201).send(comments);
});

// this post goes to the event bus' endpoint
app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
