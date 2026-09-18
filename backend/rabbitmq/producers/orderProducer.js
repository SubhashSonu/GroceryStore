import { getChannel } from "../connection.js";

const EXCHANGE_NAME = "order_events";

const publishOrderCreated = async(order)=>{
   try {
     const channel = getChannel();

    // Ensure exchange exists
    await channel.assertExchange(EXCHANGE_NAME,"topic",{
        durable: true,
    });

    // publish order event
    channel.publish(
        EXCHANGE_NAME,
        "order.created",
        Buffer.from(JSON.stringify(order)),
        {
            persistent: true,
        }
    );

    console.log("📤 Order Published");
   } catch (error) {
    console.error("Failed to publish order created event:", error);
   }
};

const publishOrderStatusUpdated = async(order)=>{
    try {
        const channel = getChannel();

        await channel.assertExchange(EXCHANGE_NAME,"topic",{
            durable: true,
        });

        channel.publish(
            EXCHANGE_NAME,
            "order.status.updated",
            Buffer.from(JSON.stringify(order)),
            {
                persistent: true,
            }
        );

         console.log("📦 Order Status Updated Event Published");
    } catch (error) {
        console.error("Failed to publish order status updated event:", error);
    }
}

export {
    publishOrderCreated,
    publishOrderStatusUpdated,
};