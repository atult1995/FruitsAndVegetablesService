const amqplib = require("amqplib");
const {
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  QUEUE_NAME,
  SHOPPING_BINDING_KEY,
} = require("../config");
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

//2. publish message
const PublishMessage = async (channel, binding_key, message) => {
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log("Message has been sent" + message);
  } catch (e) {
    throw e;
  }
};

//3. subscribe message
const SubscribeMessage = async (channel, service) => {
  const appQueue = await channel.assertQueue(QUEUE_NAME);
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, SHOPPING_BINDING_KEY);
  channel.consume(appQueue.queued, (data) => {
    console.log("Received  data");
    console.log(JSON.parse(data.content.toString()));
    service.SubscribeEvents(JSON.parse(data.content.toString()));
    channel.ack(data);
  });
};

module.exports = {
  CreateChannel,
  SubscribeMessage,
  PublishMessage,
};
