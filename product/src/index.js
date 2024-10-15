const express = require("express");
const expressApp = require("./express-app");
const { databaseConnection } = require("./database");
const { CreateChannel } = require("./utils");

const createServer = async () => {
  const app = express();

  // app.use("/", (req, res, next) => {
  //   res.status(200).json({ msg: "in product" });
  // });
  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, express, channel);

  app.listen(process.env.PORT, () => {
    console.log("Listening at port", process.env.PORT);
  });
};
createServer();
