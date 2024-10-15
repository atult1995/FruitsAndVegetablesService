module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  SECRET_CODE: process.env.SECRET_CODE,
  globalVar: require("./global-var"),
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  EXCHANGE_NAME: "ONLINE_SHOPPING",
  CUSTOMER_BINDING_KEY: "CUSTOMER_SERVICE",
  QUEUE_NAME: "CUSTOMER_QUEUE",
};
