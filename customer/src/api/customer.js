const { SubscribeMessage } = require("../utils");
const { globalVar } = require("../config");
const CustomerService = require("../service/customer-service");
const { auth } = require("./middleware");

module.exports = async (app, channel) => {
  const customerService = new CustomerService();

  SubscribeMessage(channel, customerService);

  app.post("/signup", async (req, res) => {
    const { name, email, password, phone } = req.body;
    const { response, message, code } = await customerService.createCustomer({
      name,
      email,
      password,
      phone,
    });

    res.status(code).send({ response, message, code });
  });

  app.post("/address", auth, async (req, res) => {
    const { city, country, street, postalCode } = req.body;
    const { response, message, code } = await customerService.createAddress({
      customerId: req.user._id,
      city,
      country,
      street,
      postalCode,
    });
    res.status(code).send({ response, message, code });
  });

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { response, message, code } = await customerService.customerLogin({
      email,
      password,
    });

    res.status(code).send({ response, message, code });
  });

  app.post("/wishlist", auth, async (req, res) => {
    const { productId, banner, description, available, price } = req.body;
    const { response, message, code } = await customerService.addToWishlist({
      customerId: req.user._id,
      productId,
      banner,
      description,
      available,
      price,
    });
    res.status(code).send({ response, message, code });
  });

  app.post("/cart", auth, async (req, res) => {
    const { productId, banner, price, name, unit } = req.body;
    const { response, message, code } = await customerService.addToCart({
      customerId: req.user._id,
      productId,
      banner,
      price,
      name,
      unit,
    });
    res.status(code).send({ response, message, code });
  });

  app.get("/wishlist", auth, async (req, res) => {
    const { response, message, code } =
      await customerService.getCustomerWishlist({
        customerId: req.user._id,
      });
    res.status(code).send({ response, message, code });
  });

  app.get("/cart", auth, async (req, res) => {
    const { response, message, code } = await customerService.getCustomerCart({
      customerId: req.user._id,
    });
    res.status(code).send({ response, message, code });
  });

  // app.delete("/cart", auth, async (req, res) => {
  //   const { response, code } = await customerService.deleteCartItems({
  //     _id: req.user._id,
  //   });
  //   res.status(code).send({ msg: response });
  // });

  app.delete("/wishlist/:id", auth, async (req, res) => {
    const { response, message, code } =
      await customerService.deleteWishlistItems({
        customerId: req.user._id,
        productId: req.params.id,
      });
    console.log(response, message, code);
    res.status(code).send({ response, message, code });
  });

  // app.delete("/cart/:id", auth, async (req, res) => {
  //   const { response, code } = await customerService.deleteCartItem({
  //     _id: req.user._id,
  //     productId: req.params.id,
  //   });
  //   res.status(code).send({ msg: response });
  // });

  app.delete("/wishlist/:id", auth, async (req, res) => {
    const { response, message, code } =
      await customerService.deleteWishlistItem({
        customerId: req.user._id,
        productId: req.params.id,
      });
    res.status(code).send({ response, message, code });
  });

  app.post("/logout", auth, async (req, res) => {
    const { response, message, code } = await customerService.customerLogout({
      customerId: req.user._id,
      token: req.token,
    });
    res.status(code).send({ response, message, code });
  });

  app.post("/logout-all-session", auth, async (req, res) => {
    const { response, message, code } =
      await customerService.customerLogoutFromAllTheSession({
        customerId: req.user._id,
        token: req.token,
      });
    await supportFunctionForLogoutUser({ response, message, code, res });
  });
};
