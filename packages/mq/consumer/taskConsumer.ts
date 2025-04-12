import amqp from 'amqplib';
import { TASK_QUEUE, RABBITMQ_URL } from '@repo/backend-common/config';
import {CanvasElement} from "@repo/common/types"
import {prisma} from "@repo/db/client";

const consumeMessage = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(TASK_QUEUE, { durable: true });

    console.log(`Waiting for messages in ${TASK_QUEUE}...`);

    channel.consume(TASK_QUEUE, async (msg) => {
      if (msg) {
        const messageContent = msg.content.toString();
        console.log(`Received: ${messageContent}`);

        try {
          const data = JSON.parse(messageContent);
          const element:CanvasElement = data.element;
          const roomId:string = data.roomId;
          const userId:string = data.userId;
          await saveElement(element,roomId,userId);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    });
  } catch (error) {
    console.error('Error in consumer:', error);
  }
};

async function saveElement(element:CanvasElement,roomId:string,userId:string){
    await prisma.canvasElement.create({
        data:{
            ...element,
            roomId:roomId,
            userId:userId
        }
    });
}

consumeMessage();
