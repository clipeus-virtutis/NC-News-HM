const { checkArticleExists, checkCommentsExist } = require("../db/helpers/utils");
const {
  fetchArticle,
  updateArticle,
  fetchArticles,
  fetchCommentNumber,
  fetchComments,
  addComment,
} = require("../models/article-models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([fetchArticle(article_id), fetchCommentNumber(article_id)])
    .then((response) => {
      response[0].comment_count = response[1].rows[0].comment_count;
      res.status(200).send({ article: response[0] });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const articleId = req.params;
  const articleUpdate = req.body;

  updateArticle(articleId, articleUpdate)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([checkArticleExists(article_id), fetchComments(article_id)])
    .then((response) => {
      res.status(200).send({ comments: response[1].rows });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  // console.log(article_id, "arty ID");
  // console.log(req.body, "BODY");

  // Promise.all([checkArticleExists(article_id), addComment(article_id, req.body)])
  addComment(article_id, req.body)
    .then((response) => {
      res.status(201).send({ comment: response });
    })
    .catch(next);
};
