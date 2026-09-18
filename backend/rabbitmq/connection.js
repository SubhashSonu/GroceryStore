import amqp from "amqplib";

let connection;
let channel;

const connectRabbitMq = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);

    channel = await connection.createChannel();

    console.log("✅ RabbitMQ Connected");
  } catch (error) {
    console.error("Error occured to RabbitMq:", error);
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ Channel not initialized");
  }

  return channel;
};

export {
  connectRabbitMq,
  getChannel,
};
