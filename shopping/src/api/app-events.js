const auth = require("./middleware/auth");
const { ShoppingService } = require("../service");

module.exports = async (app) => {
  const shoppingService = new ShoppingService();
  app.post("/app-events", async (req, res) => {
    console.log("==== shopping events subscribed ====");
    const { response, message, code } = await shoppingService.ShoppingEvents(
      req.body
    );
    console.log(req.body);
    if (code === 200) {
      res.status(code).send({
        response: "",
        message: "Notification received and " + message,
        code,
      });
    } else {
      res.status(code).send({
        response: "",
        message: "Notification received and " + message,
        code,
      });
    }
  });

  // app.post("/user", async (req, res) => {
  //   const { response, message, code } = await shoppingService.ShoppingEvents(
  //     req.body
  //   );
  //   res.status(code).send({
  //     response,
  //     message,
  //     code,
  //   });
  // });
};
