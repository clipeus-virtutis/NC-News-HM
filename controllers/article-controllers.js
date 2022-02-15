const { checkArticleExists } = require("../db/helpers/utils");
const { fetchArticle, updateArticle } = require("../models/article-models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([checkArticleExists(article_id), fetchArticle(article_id)])
    .then((response) => {
      res.status(200).send({ article: response[0][0] });
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
