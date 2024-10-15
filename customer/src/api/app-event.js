const { auth } = require("./middleware");
module.exports = async (app) => {
  const CustomerService = require("../service/customer-service");
  app.post("/app-events", auth, async (req, res) => {
    const customerService = new CustomerService();
    const payload = req.body;
    console.log(payload);
    const { message, code } = await customerService.SubscribeEvents(payload);
    console.log("===== event subscribed ====");

    res
      .status(code)
      .send({ response: "", message: "Notified and " + message, code });
  });
};
