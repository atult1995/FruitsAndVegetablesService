const jwt = require("jsonwebtoken");
const axios = require("axios");

const amqplib = require("amqplib");
const {
  MESSAGE_BROKER_URL,
  CUSTOMER_BINDING_KEY,
  EXCHANGE_NAME,
  QUEUE_NAME,
} = require("../config");

const generateAuthToken = async function () {
  if (!this) throw Error("There is error");
  const token = jwt.sign({ _id: this._id }, "thisismykey", {
    expiresIn: "7 day",
  });

  this.tokens = this.tokens.concat({ token });

  await this.save();

  return token;
};

const PublishUserLoggedInOutEvent = async (payload) => {
  try {
    const response = axios.post(
      "http://localhost:8000/shopping/app-events",
      payload
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

//message broker

//1. create channel
const CreateChannel = async () => {
  try {
    const connect = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connect.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (e) {
    throw e;
  }
};

// //2. publish message
// module.exports.PublishMessage = async (channel, binding_key, message) => {
//   try {
//     await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
//   } catch (e) {
//     throw e;
//   }
// };

//3. subscribe message
const SubscribeMessage = async (channel, service) => {
  const appQueue = await channel.assertQueue(QUEUE_NAME);
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, CUSTOMER_BINDING_KEY);
  channel.consume(appQueue.queued, (data) => {
    console.log("Received  data");

    service.SubscribeEvents(JSON.parse(data.content.toString()));
    channel.ack(data);
  });
};

module.exports = {
  generateAuthToken,
  CreateChannel,
  SubscribeMessage,
};
