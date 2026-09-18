import { getChannel } from "../connection.js";

const EXCHANGE_NAME = "user_events";

const publishUserCreated = async(user)=>{
   try {
    const channel = getChannel();

    // Ensure exchange exists
    await channel.assertExchange(EXCHANGE_NAME, "topic",{
        durable: true,
    });
    // publish user event
    channel.publish(
        EXCHANGE_NAME,
        "user.created",
        Buffer.from(JSON.stringify(user)),
        {
            persistent: true,
        }
    )
    console.log("📤 User Created Event Published");
   } catch (error) {
    console.error("Failed to publish user event:", error);
   }
};

const publishPasswordResetRequested = async(data)=>{
    try {
        const channel = getChannel();

        await channel.assertExchange(EXCHANGE_NAME,"topic",{
            durable: true,
        });

        channel.publish(
            EXCHANGE_NAME,
            "password.reset",
            Buffer.from(JSON.stringify(data)),
            {
                persistent: true,
            }
        );
        console.log("📤 Password Reset Event Published");

    } catch (error) {
        console.error("Failed to publish user event:", error);
    }
};

export {
    publishUserCreated,
    publishPasswordResetRequested,
}