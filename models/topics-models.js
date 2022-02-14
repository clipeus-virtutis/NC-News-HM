const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.fetchArticle = (articleId) => {
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [articleId]).then((results) => {
    return results.rows[0];
  });
};
