const { checkArticleExists, checkCommentExists } = require("../db/helpers/utils");

exports.handlesCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlesPsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request - incorrect body data" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Bad Request - username doesn't exist" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request - invalid input" });
  } else next(err);
};

exports.handles500Errors = (err, req, res, next) => {
  console.log(err, "err");
  res.status(500).send({ msg: "Server Error" });
};
