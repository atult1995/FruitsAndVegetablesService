const { response } = require("express");
const { ProductService } = require("../service");
const { PublishCustomerEvent, PublishShoppingEvent } = require("../utils");
const auth = require("./middleware");

module.exports = async (app) => {
  const productService = new ProductService();
  app.post("/create", auth, async (req, res) => {
    const {
      name,
      description,
      banner,
      unit,
      available,
      type,
      price,
      supplier,
    } = req.body;
    const { response, code } = await productService.createProduct({
      name,
      description,
      banner,
      unit,
      available,
      type,
      price,
      supplier,
    });
    res.status(code).send({ response });
  });

  app.get("/fetch", async (req, res) => {
    const { response, code } = await productService.fetchProduct();
    res.status(code).send({ response });
  });
  app.get("/fetch/:id", async (req, res) => {
    const { response, code } = await productService.fetchProductById({
      _id: req.params.id,
    });
    res.status(code).send({ response });
  });

  app.post("/add-to-cart/:id", auth, async (req, res) => {
    try {
      const { response: product, code } = await productService.fetchProductById(
        {
          _id: req.params.id,
        }
      );

      if (code === 200) {
        //inform to customer
        const {
          banner,
          price,
          name,
          unit,
          description,
          available,
          type,
          supplier,
        } = product;
        const productId = product._id;
        const customerEventResponse = await PublishCustomerEvent({
          event: "ADD_TO_CART",
          data: { _id: req._id, productId, banner, price, name, unit },
          headers: {
            Authorization: "Bearer " + req.token,
          },
        });
        const shoppingEventResponse = await PublishShoppingEvent({
          event: "ADD_TO_CART",
          data: {
            customerId: req._id,
            productId,
            banner,
            price,
            name,
            unit,
            description,
            available,
            type,
            supplier,
          },
        });
        if (
          customerEventResponse.status === 200 &&
          shoppingEventResponse.status === 200
        ) {
          res.status(customerEventResponse.status).send({
            message: {
              customerResMessage: customerEventResponse.data.message,
              shoppingResMessage: shoppingEventResponse.data.message,
            },
            code: customerEventResponse.status,
            data: "",
          });
        } else {
          //check error with which res
          if (customerEventResponse === 400) {
            res.status(customerEventResponse.status).send({
              message: customerEventResponse.response.data,
              code: customerEventResponse.status,
              response: "",
            });
          } else {
            res.status(shoppingEventResponse.status).send({
              message: shoppingEventResponse.response.data,
              code: shoppingEventResponse.status,
              response: "",
            });
          }

          res.status(response.status).send({
            message: response.response.data,
            code: response.status,
            response: "",
          });
        }
      }
    } catch (e) {
      res
        .status(400)
        .send({ response: "", message: "Product was not found", code: 400 });
    }
  });

  app.post("/add-to-wishlist/:id", auth, async (req, res) => {
    try {
      const { response: product, code } = await productService.fetchProductById(
        {
          _id: req.params.id,
        }
      );

      if (code === 200) {
        //inform to customer
        const { banner, description, available, price } = product;

        const productId = product._id;
        const response = await PublishCustomerEvent({
          event: "ADD_TO_WISHLIST",
          data: {
            _id: req._id,
            productId,
            banner,
            price,
            description,
            available,
          },
        });
        if (response.status === 200) {
          res.status(response.status).send({
            message: response.data.message,
            code: response.status,
            data: "",
          });
        } else {
          res.status(response.status).send({
            message: response.response.data,
            code: response.status,
            response: "",
          });
        }
      }
    } catch (e) {
      res
        .status(400)
        .send({ response: "", message: "Product was not found", code: 400 });
    }
  });
};
