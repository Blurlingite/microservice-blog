import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());

const events: any[] = [];
// this endpoint receives events from other services
app.post("/events", (req, res) => {
  const event = req.body;

  // add this event to the array of events so we have a list of all events that we can give tto a service if they missed those events (if they were disconnected or created late)
  events.push(event);
  // then it sends the events to each service that needs events
  axios.post("http://localhost:4000/events", event);
  axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event);

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
