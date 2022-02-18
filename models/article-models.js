const db = require("../db/connection");
const { checkArticleExists } = require("../db/helpers/utils");

exports.fetchArticles = () => {
  return db
    .query("SELECT author, title, article_id, topic, created_at, votes FROM articles ORDER BY created_at desc;")
    .then((results) => {
      return results.rows;
    });
};

exports.fetchArticle = (articleId) => {
  return checkArticleExists(articleId).then((results) => {
    return results[0];
  });
};

exports.fetchCommentNumber = (articleId) => {
  return db.query(
    `
  SELECT articles.article_id, COUNT(comments.comment_id) AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`,
    [articleId]
  );
};

exports.fetchComments = (articleId) => {
  return db.query(
    `
        SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments
        LEFT JOIN articles ON articles.article_id = comments.article_id
        WHERE comments.article_id = $1;
        `,
    [articleId]
  );
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
