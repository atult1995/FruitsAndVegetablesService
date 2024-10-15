const jwt = require("jsonwebtoken");
const { LOGGED_IN_USER } = require("../../utils");
const auth = async (req, res, next) => {
  if (!req.header("Authorization"))
    res.status(400).send({ response: "Please authenticate", code: 400 });
  const token = req.header("Authorization").replace("Bearer ", "");
  const decode = jwt.verify(token, "thisismykey");
  if (
    LOGGED_IN_USER.user?._id === decode._id &&
    LOGGED_IN_USER.token === token
  ) {
    next();
  } else {
    res.status(400).send({ response: "Please authenticate", code: 400 });
  }
};

module.exports = auth;
