const express = require("express");
const { getArticle, patchArticle } = require("./controllers/article-controllers");
const { handlesCustomErrors } = require("./controllers/error-controllers");
const { getTopics } = require("./controllers/topics-controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);

app.patch("/api/articles/:article_id", patchArticle);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlesCustomErrors);

module.exports = app;
