import { z,CreateCanvasElementSchema } from "@repo/common/types";

export enum MessageType {
    JOIN_ROOM,
    LEAVE_ROOM,
    ELEMENT,
    PING
}

export type CanvasElement = z.infer<typeof CreateCanvasElementSchema>;