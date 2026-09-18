import { getChannel } from "../connection.js";
import { sendOrderEmail } from "../../utils/emailService.js";

const QUEUE_NAME = "order_status_email_queue";
const EXCHANGE_NAME = "order_events";
const BINDING_KEY = "order.status.updated";

const startOrderStatusConsumer = async () => {
  try {
    const channel = getChannel();

    await channel.assertExchange(EXCHANGE_NAME, "topic", {
      durable: true,
    });

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    await channel.bindQueue(
      QUEUE_NAME,
      EXCHANGE_NAME,
      BINDING_KEY
    );

    console.log("📦 Order Status Consumer Started...");

    channel.consume(
      QUEUE_NAME,
      async (message) => {
        try {
          if (!message) return;

          const order = JSON.parse(message.content.toString());

          console.log("📦 Processing Order Status...");

          await sendOrderEmail(
            order.customerEmail,
            order.orderId,
            order.status,
            order.items,
            order.total
          );

          channel.ack(message);
        } catch (error) {
          console.error("Order Status Consumer:", error);

          channel.nack(message, false, false);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.error(
      "Failed to start Order Status Consumer:",
      error
    );

    process.exit(1);
  }
};

export { startOrderStatusConsumer };