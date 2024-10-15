const cors = require("cors");
const { shoppingApi, appEvents } = require("../src/api");

module.exports = async (app, express) => {
  app.use(cors());

  app.use(express.json());
  await shoppingApi(app);
  await appEvents(app);
};
