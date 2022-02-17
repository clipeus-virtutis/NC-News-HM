const { checkArticleExists } = require("../db/helpers/utils");
const { fetchArticle, updateArticle, fetchArticles, fetchCommentNumber } = require("../models/article-models");

exports.getArticles = (req, res, next) => {
  fetchArticles()
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
  Promise.all([checkArticleExists(articleId.article_id), updateArticle(articleId, articleUpdate)])
    .then((response) => {
      res.status(200).send({ article: response[1] });
    })
    .catch(next);
};
