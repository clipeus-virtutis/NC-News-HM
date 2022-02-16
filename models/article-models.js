const db = require("../db/connection");
const { checkArticleExists } = require("../db/helpers/utils");

exports.fetchArticle = (articleId) => {
  return checkArticleExists(articleId).then((results) => {
    return results[0];
  });
};

exports.updateArticle = (articleId, votes) => {
  if (!votes.inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad Request - incorrect body format" });
  }
  return checkArticleExists(articleId.article_id).then(() => {
    return db
      .query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;", [
        votes.inc_votes,
        articleId.article_id,
      ])
      .then((results) => {
        return results.rows[0];
      });
  });
};
