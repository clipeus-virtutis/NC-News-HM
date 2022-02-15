const db = require("../db/connection");

exports.fetchArticle = (articleId) => {
  return db.query("SELECT * FROM articles WHERE article_id = $1;", [articleId]).then((results) => {
    if (results.rows.length < 1) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    } else {
      return results.rows[0];
    }
  });
};

exports.updateArticle = (articleId, votes) => {
  //console.log("MODEL");
  //console.log(articleId, votes, "MODEL ARTICLE ID AND VOTES");
  if (!votes.inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db.query("SELECT votes FROM articles WHERE article_id = $1;", [articleId.article_id]).then((response) => {
    console.log(response.rows, "RESPONSE ROWS");
    const newVotes = (response.rows[0].votes = response.rows[0].votes + votes.inc_votes);
    console.log(response.rows, "AFTER CHANGE");
    return db
      .query("UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;", [newVotes, articleId.article_id])
      .then((response) => {
        console.log(response.rows, "RESPONSE ROWS END");
        return response.rows[0];
      });
  });
};
