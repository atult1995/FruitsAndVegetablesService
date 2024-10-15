const express = require("express");
const expressApp = require("./express-app");
const app = express();
const { databaseConnection } = require("./database");
const { CreateChannel } = require("./utils");

const StartSever = async () => {
  // app.use("/", (req, res, next) => {
  //   console.log("kjkjkjjkkj");
  //   res.status(200).json({ msg: "in customer" });
  // });
  await databaseConnection();

  const channel = await CreateChannel();

  await expressApp(app, channel);

  app
    .listen(process.env.PORT, () => {
      console.log("Listening at port", process.env.PORT);
    })
    .on("error", (error) => {
      console.log(error);
      process.exit();
    });
};
StartSever();
