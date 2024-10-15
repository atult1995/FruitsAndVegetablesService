const cors = require("cors");
const express = require("express");
const { customer, appEvents } = require("./api");
module.exports = async (app, channel) => {
  app.use(cors());
  app.use(express.json());
  await customer(app, channel);
  //await appEvents(app);
};
