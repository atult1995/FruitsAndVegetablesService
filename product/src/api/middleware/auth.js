const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  if (!req.header("Authorization")) {
    res.status(400).send({ response: "Please authenticate", code: 400 });
  }
  const token = req.header("Authorization").replace("Bearer ", "");
  const decode = jwt.verify(token, "thisismykey");
  req._id = decode._id;
  req.token = token;
  next();
};

module.exports = auth;
