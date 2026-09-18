import { getChannel } from "../connection.js";
import { sendOrderConfirmationEmail } from "../../utils/emailService.js";

const QUEUE_NAME = "order_email_queue";
const EXCHANGE_NAME = "order_events";
const BINDING_KEY = "order.created";

const startEmailConsumer = async () => {
  try {
    const channel = getChannel();

    await channel.assertExchange(EXCHANGE_NAME, "topic", {
      durable: true,
    });

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, BINDING_KEY);
    console.log("📧 Email Consumer Started...");

    channel.consume(
      QUEUE_NAME,
      async (message) => {
        try {
          if (!message) return;

          const order = JSON.parse(message.content.toString());

          console.log("📧 Processing Email...");

          console.log(order);
          await sendOrderConfirmationEmail(order);

          channel.ack(message);
        } catch (error) {
          console.error(error);

          channel.nack(message, false, false);
        }
      },
      {
        noAck: false,
      },
    );
  } catch (error) {
    console.error("Failed to start Email Consumer:", error);

    process.exit(1);
  }
};

export {
  startEmailConsumer,
};
