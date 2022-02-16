const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT username FROM users;").then((result) => {
    console.log(result.rows, "RESULT");
    return result.rows;
  });
};
