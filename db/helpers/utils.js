const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkArticleExists = (id, next) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: `ID ${id} not found` });
      } else {
        return rows;
      }
    })
    .catch(next);
};

exports.checkCommentsExist = (articleId, next) => {
  return db
    .query(
      `
            SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments
            LEFT JOIN articles ON articles.article_id = comments.article_id
            WHERE comments.article_id = $1;
            `,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: `No comments found` });
      } else {
        return rows;
      }
    })
    .catch(next);
};

exports.checkCommentExists = (commentID, next) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [commentID])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found - comment doesn't exist" });
      } else {
        return rows;
      }
    })
    .catch(next);
};
