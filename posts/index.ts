import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";
import cors from "cors";
import axios from "axios";

// const express = require("express");
// const bodyParser = require("body-parser");
// const { randomBytes } = require("crypto");
// const cors = require("cors");
// const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

interface Post {
  id: string;
  title: string;
}
interface PostObjectOfObjects {
  [id: string]: Post;
}

const posts: PostObjectOfObjects = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id: string = randomBytes(4).toString("hex");
  const { title }: { title: string } = req.body;

  posts[id] = {
    id,
    title,
  };

  // right after adding the post, send event to event bus' URL along with the data (the postt just created)
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

// this post goes to the event bus' endpoint
app.post("/events", (req, res) => {
  console.log("Received Event", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
