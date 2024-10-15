const { CUSTOMER_BINDING_KEY } = require("../config");
const { ShoppingService } = require("../service");
const { SubscribeMessage, PublishMessage } = require("../utils");
const auth = require("./middleware/auth");

module.exports = async (app, channel) => {
  const shoppingService = new ShoppingService();

  SubscribeMessage(channel, shoppingService);

  app.post("/create-order", auth, async (req, res) => {
    const { response, message, code } = await shoppingService.createOrder({
      customerId: req._id,
    });

    const data = {
      customerId: response.customerId,
      orderId: response.orderId,
      amount: response.amount,
      date: response.timestamp,
    };
    PublishMessage(
      channel,
      CUSTOMER_BINDING_KEY,
      JSON.stringify({ data, event: "CREATE_ORDER" })
    );
    res.status(code).send({ response, message, code });
  });

  app.post("/cart", auth, async (req, res) => {
    const {
      productId,
      name,
      description,
      banner,
      type,
      unit,
      price,
      supplier,
    } = req.body;
    const customerId = req._id;
    const { response, message, code } = await shoppingService.addItemToCart({
      productId,
      name,
      description,
      banner,
      type,
      unit,
      price,
      supplier,
      customerId,
    });
    res.status(code).send({ response, message, code });
  });
  // app.put("/add-to-cart", auth, async (req, res) => {
  //   // customerId, qty, action
  //   const customerId = req._id;
  //   const { qty, action } = req.body;
  //   const { response, message, code } =
  //     await shoppingService.incDecCartItemCount({ customerId, qty, action });
  //   res.status(code).send({ response, message, code });
  // });

  app.delete("/cart", auth, async (req, res) => {
    const { response, message, code } = await shoppingService.deleteCartItems({
      customerId: req._id,
    });
    res.status(code).send({ response, message, code });
  });

  app.delete("/cart/:id", auth, async (req, res) => {
    const { response, message, code } = await shoppingService.deleteCartItem({
      customerId: req._id,
      productId: req.params.id,
    });
    res.status(code).send({ response, message, code });
  });

  app.get("/cart", auth, async (req, res) => {
    const { response, message, code } = await shoppingService.getCustomerCart({
      customerId: req._id,
    });
    res.status(code).send({ response, message, code });
  });
};
