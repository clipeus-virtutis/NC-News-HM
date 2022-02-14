const express = require("express");

const app = express();

app.get("/api/topics" /*func name*/);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
