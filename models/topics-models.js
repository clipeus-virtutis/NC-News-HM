const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then((result) => {
    return result.rows;
  });
};

exports.fetchArticle = (articleId) => {
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [articleId]).then((results) => {
    if (results.rows.length < 1) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    } else {
      return results.rows[0];
    }
  });
};
