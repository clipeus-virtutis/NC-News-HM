const express = require("express");
const { handlesCustomErrors } = require("./controllers/error-controllers");
const { getTopics, getArticle } = require("./controllers/topics-controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlesCustomErrors);

module.exports = app;
