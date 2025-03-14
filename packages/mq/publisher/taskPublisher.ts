import amqp from "amqplib";
import { TASK_QUEUE, RABBITMQ_URL } from "@repo/backend-common/config";

let channel: amqp.Channel | null = null;


async function connectRabbitMQ() {
    try {
        console.log('Connecting to RabbitMQ...');
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();

        await channel.prefetch(100);
        await channel.assertQueue(TASK_QUEUE, { durable: true });

        console.log(`Connected to RabbitMQ. Ready to publish messages.`);

        connection.on('close', () => {
            console.error('RabbitMQ connection closed. Reconnecting...');
            setTimeout(connectRabbitMQ, 5000);
        });

        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
            setTimeout(connectRabbitMQ, 5000);
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        setTimeout(connectRabbitMQ, 5000);
    }
}


export async function publishMessage(message: string) {
    if (!channel) {
        console.error('Channel is not initialized. Message not sent.');
        return;
    }

    channel.sendToQueue(TASK_QUEUE, Buffer.from(message), {
        persistent: true,
    });

    console.log(`[x] Sent: ${message}`);
}


connectRabbitMQ();