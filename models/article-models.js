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
  return db.query("SELECT votes FROM articles WHERE article_id = $1;", [articleId.article_id]).then((results) => {
    //console.log(results.rows, "RESULTS ROWS ABOVE REJECTION");
    if (results.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "ID Not Found" });
    } else {
      //console.log(results.rows, "RESPONSE ROWS");
      const newVotes = (results.rows[0].votes = results.rows[0].votes + votes.inc_votes);
      //console.log(results.rows, "AFTER CHANGE");
      return db
        .query("UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *;", [newVotes, articleId.article_id])
        .then((results) => {
          console.log(results.rows, "RESPONSE ROWS END");
          return results.rows[0];
        });
    }
  });
};
