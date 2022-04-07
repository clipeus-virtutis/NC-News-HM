const cors = require("cors");
const express = require("express");
const { getApi } = require("./controllers/api-controllers");
const {
  getArticle,
  patchArticle,
  getArticles,
  getComments,
  postComment,
  deleteComment,
} = require("./controllers/article-controllers");
const { handlesCustomErrors, handles500Errors, handlesPsqlErrors } = require("./controllers/error-controllers");
const { getTopics } = require("./controllers/topics-controllers");
const { getUsers } = require("./controllers/user-controllers");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handlesCustomErrors);
app.use(handlesPsqlErrors);
app.use(handles500Errors);

module.exports = app;
