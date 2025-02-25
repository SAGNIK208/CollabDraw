import { z,CreateCanvasElementSchema } from "@repo/common/types";

export enum MessageType {
    JOIN_ROOM="JOIN_ROOM",
    LEAVE_ROOM="LEAVE_ROOM",
    ELEMENT="ELEMENT",
    PING="PING"
}

export type CanvasElement = z.infer<typeof CreateCanvasElementSchema>;