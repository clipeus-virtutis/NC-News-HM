const { fetchArticle, updateArticle } = require("../models/article-models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const articleId = req.params;
  //console.log(req.body, "REQ BODY");
  const articleUpdate = req.body;
  //console.log(articleId, articleUpdate, "ARTICLE ID AND ARTICLEUPDATE");
  updateArticle(articleId, articleUpdate)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
