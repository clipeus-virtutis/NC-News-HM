exports.handlesCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handles500Errors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error" });
};
