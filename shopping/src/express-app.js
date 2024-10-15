const cors = require("cors");
const { shoppingApi } = require("../src/api");

module.exports = async (app, express, channel) => {
  app.use(cors());

  app.use(express.json());
  await shoppingApi(app, channel);
};
