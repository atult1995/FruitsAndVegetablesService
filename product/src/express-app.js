const cors = require("cors");
const { product } = require("./api");
module.exports = async (app, express) => {
  app.use(cors());
  app.use(express.json());
  await product(app);
};
