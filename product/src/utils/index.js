const amqplib = require("amqplib");

const {
  MESSAGE_BROKER_URL,
  EXCHANGE_NAME,
  QUEUE_NAME,
  PRODUCT_BINDING_KEY,
} = require("../config");

//message broker

//1. create channel
module.exports.CreateChannel = async () => {
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
module.exports.PublishMessage = async (channel, binding_key, message) => {
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    //console.log("Message has been sent" + message);
  } catch (e) {
    throw e;
  }
};

//3. subscribe message
module.exports.SubscribeMessage = async (channel, service) => {
  const appQueue = await channel.assertQueue(QUEUE_NAME);
  channel.bindQueue(appQueue.queue, EXCHANGE_NAME, PRODUCT_BINDING_KEY);
  channel.consume(appQueue.queued, (data) => {
    console.log("Received  data");

    channel.ack(data);
  });
};
