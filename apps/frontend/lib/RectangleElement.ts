import { CanvasElementType } from "@repo/common/types";
import { CanvasElement } from "./CanvasElement";

export class RectangleElement extends CanvasElement{
    constructor(data:CanvasElementType){
        super(data);
    }

    draw(ctx:CanvasRenderingContext2D):void{
        ctx.beginPath();
        ctx.rect(this.element.x!, this.element.y!, this.element.width!, this.element.height!);
        ctx.fillStyle = this.element.fill ?? "transparent";
        ctx.fill();
        ctx.strokeStyle = this.element.stroke!;
        ctx.lineWidth = this.element.strokeWidth!;
        ctx.stroke();
    }

}