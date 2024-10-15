const jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "thisismykey");
    req._id = decode._id;
    req.token = token;
    next();
  } catch (e) {
    res.status(400).send({ response: "", message: e.message, code: 400 });
  }
};

module.exports = auth;
