const {
  PublishUserLoggedInOutEvent,
  supportFunctionForLoginUser,
  supportFunctionForLogoutUser,
} = require("../utils");
const { globalVar } = require("../config");
const CustomerService = require("../service/customer-service");
const { auth } = require("./middleware");

module.exports = async (app) => {
  const customerService = new CustomerService();

  app.post("/signup", async (req, res) => {
    const { name, email, password, phone } = req.body;
    const { response, message, code } = await customerService.createCustomer({
      name,
      email,
      password,
      phone,
    });

    await supportFunctionForLoginUser({ response, message, code, res });
  });

  app.post("/address", auth, async (req, res) => {
    const { city, country, street, postalCode } = req.body;
    const { response, code } = await customerService.createAddress({
      _id: req.user._id,
      city,
      country,
      street,
      postalCode,
    });
    res.status(code).send({ msg: response });
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { response, message, code } = await customerService.customerLogin({
      email,
      password,
    });
    await supportFunctionForLoginUser({ response, message, code, res });
  });

  app.post("/wishlist", auth, async (req, res) => {
    const { productId, banner, description, available, price } = req.body;
    const { response, code } = await customerService.addToWishlist({
      _id: req.user._id,
      productId,
      banner,
      description,
      available,
      price,
    });
    res.status(code).send({ msg: response });
  });

  app.post("/cart", auth, async (req, res) => {
    const { productId, banner, price, name, unit } = req.body;
    const { response, message, code } = await customerService.addToCart({
      _id: req.user._id,
      productId,
      banner,
      price,
      name,
      unit,
    });
    res.status(code).send({ response, message, code });
  });

  app.get("/wishlist", auth, async (req, res) => {
    const { response, code } = await customerService.getCustomerWishlist({
      _id: req.user._id,
    });
    res.status(code).send({ msg: response });
  });

  app.get("/cart", auth, async (req, res) => {
    const { response, code } = await customerService.getCustomerCart({
      _id: req.user._id,
    });
    res.status(code).send({ msg: response });
  });

  app.delete("/cart", auth, async (req, res) => {
    const { response, code } = await customerService.deleteCartItems({
      _id: req.user._id,
    });
    res.status(code).send({ msg: response });
  });

  app.delete("/wishlist", auth, async (req, res) => {
    const { response, code } = await customerService.deleteWishlistItems({
      _id: req.user._id,
    });
    res.status(code).send({ msg: response });
  });

  app.delete("/cart/:id", auth, async (req, res) => {
    const { response, code } = await customerService.deleteCartItem({
      _id: req.user._id,
      productId: req.params.id,
    });
    res.status(code).send({ msg: response });
  });

  app.delete("/wishlist/:id", auth, async (req, res) => {
    const { response, code } = await customerService.deleteWishlistItem({
      _id: req.user._id,
      productId: req.params.id,
    });
    res.status(code).send({ msg: response });
  });

  app.post("/logout", auth, async (req, res) => {
    const { response, message, code } = await customerService.customerLogout({
      _id: req.user._id,
      token: req.token,
    });
    await supportFunctionForLogoutUser({ response, message, code, res });
  });

  app.post("/logout-all-session", auth, async (req, res) => {
    const { response, message, code } =
      await customerService.customerLogoutFromAllTheSession({
        _id: req.user._id,
        token: req.token,
      });
    await supportFunctionForLogoutUser({ response, message, code, res });
  });
};
