const { ShoppingService } = require("../service");
const { PublishCustomerEvent, LOGGED_IN_USER } = require("../utils");
const auth = require("./middleware/auth");

module.exports = async (app) => {
  const shoppingService = new ShoppingService();
  app.post("/create-order", auth, async (req, res) => {
    const { response, message, code } = await shoppingService.createOrder({
      customerId: LOGGED_IN_USER.user._id,
    });

    const data = {
      _id: response.customerId,
      orderId: response.orderId,
      amount: response.amount,
      date: response.timestamp,
    };
    console.log(data);
    if (code === 200) {
      const publishCustomerResponse = await PublishCustomerEvent({
        data,
        event: "CREATE_ORDER",
        headers: {
          Authorization: "Bearer " + LOGGED_IN_USER.token,
        },
      });

      if (publishCustomerResponse.status === 200) {
        res.status(publishCustomerResponse.status).send({
          response,
          message: message + " and " + publishCustomerResponse.data.message,
          code,
        });
      } else {
        res.status(publishCustomerResponse.status).send({
          message: publishCustomerResponse.response.data,
          code: publishCustomerResponse.status,
          response: "",
        });
      }
    } else {
      res.status(code).send({ response, message, code });
    }
  });

  app.post("/add-to-cart", auth, async (req, res) => {
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
    const customerId = LOGGED_IN_USER.user._id;
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
      customerId: LOGGED_IN_USER.user._id,
    });
    res.status(code).send({ response, message, code });
  });

  app.delete("/cart/:id", auth, async (req, res) => {
    const { response, message, code } = await shoppingService.deleteCartItem({
      customerId: LOGGED_IN_USER.user._id,
      productId: req.params.id,
    });
    res.status(code).send({ response, message, code });
  });

  app.get("/cart", auth, async (req, res) => {
    const { response, message, code } = await shoppingService.getCustomerCart({
      customerId: LOGGED_IN_USER.user._id,
    });
    res.status(code).send({ response, message, code });
  });
};
