const jwt = require("jsonwebtoken");
const { SECRET } = require("../../config");
const CustomerService = require("../../service/customer-service");

const auth = async (req, res, next) => {
  try {
    const customerService = new CustomerService();
    if (!req.header("Authorization")) throw new Error("Please authenticate");

    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, "thisismykey");

    const { response, message, code } =
      await customerService.getCustomerByIdAndToken({
        _id: decode._id,
        token,
      });

    if (code !== 200) {
      throw new Error("Please authenticate");
    }

    req.user = response;
    req.token = token;
    next();
  } catch (e) {
    res.status(400).send({ response: e.message, code: 400 });
  }
};
module.exports = auth;
