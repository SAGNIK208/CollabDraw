import { CanvasElementType, Shapes } from "@repo/common/types";
import { RectangleElement } from "./RectangleElement";
import { TextElement } from "./TextElement";
import { ArrowElement } from "./ArrowElement";
import { CanvasElement } from "./CanvasElement";

export class CanvasElementFactory{
    static createCanvasElement(data:CanvasElementType) : CanvasElement{
        switch (data.type) {
            case Shapes.RECTANGLE:
              return new RectangleElement(data);
            case Shapes.TEXT:
              return new TextElement(data);
            case Shapes.ARROW:
              return new ArrowElement(data);
            default:
              throw new Error(`Unknown element type: ${data.type}`);
          }
    }
}