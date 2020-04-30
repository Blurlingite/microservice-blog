import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
// import cors from "cors";

const app = express();
app.use(bodyParser.json());
// app.use(cors());

// where we receive events from event bus
// (http://localhost:4003/events) is the URL this endpoint refers to
app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    // if the comment contains the word 'orange' set it's status to 'rejected', otherwise set it to 'approved'
    const status = data.content.includes("orange") ? "rejected" : "approved";
    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }

  // need to send a response or this request will hang
  res.send({});
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
