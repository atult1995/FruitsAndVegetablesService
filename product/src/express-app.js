const cors = require("cors");
const { product } = require("./api");
module.exports = async (app, express, channel) => {
  app.use(cors());
  app.use(express.json());
  await product(app, channel);
};
