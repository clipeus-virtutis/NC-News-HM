const db = require("../db/connection");
const { checkArticleExists, convertTimestampToDate } = require("../db/helpers/utils");

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.article_id) as INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`
    )
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

exports.addComment = (articleId, newComment) => {
  const { username, body } = newComment;
  const intArticleId = parseInt(articleId);
  return db
    .query(
      `
    INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3) RETURNING *;`,
      [body, username, intArticleId]
    )
    .then(({ rows }) => {
      return rows[0];
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
