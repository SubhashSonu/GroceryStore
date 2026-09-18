import { sendOtpEmail } from "../../utils/emailService.js";
import { getChannel } from "../connection.js";


const QUEUE_NAME = "otp_email_queue";
const EXCHANGE_NAME = "user_events";
const BINDING_KEY = "password.reset";

const startOtpConsumer = async () => {
  try {
    const channel = getChannel();

    await channel.assertExchange(EXCHANGE_NAME, "topic", {
      durable: true,
    });

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    await channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, BINDING_KEY);
    console.log("🔐 OTP Consumer Started...");

    channel.consume(
      QUEUE_NAME,
      async (message) => {
        try {
          if (!message) return;

          const { email, otp } = JSON.parse(message.content.toString());

          console.log("🔐 Processing OTP Email...");

          await sendOtpEmail(email, otp);

          channel.ack(message);
        } catch (error) {
          console.error("OTP Consumer Error:", error);

          channel.nack(message, false, false);
        }
      },
      {
        noAck: false,
      },
    );
  } catch (error) {
    console.error("Failed to start OTP Consumer:", error);
    process.exit(1);
  }
};

export {
    startOtpConsumer,
};
