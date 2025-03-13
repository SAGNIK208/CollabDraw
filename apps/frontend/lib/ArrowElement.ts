import { CanvasElementType } from "@repo/common/types";
import { CanvasElement } from "./CanvasElement";

export class ArrowElement extends CanvasElement{
    constructor(data:CanvasElementType){
        super(data);
    }

    draw(ctx:CanvasRenderingContext2D):void{
        if (!this.element.points || this.element.points.length < 2) return;
        const [start, end] = this.element.points;
        ctx.beginPath();
        ctx.moveTo(start!.x, start!.y);
        ctx.lineTo(end!.x, end!.y);
        ctx.strokeStyle = this.element.stroke!;
        ctx.lineWidth = this.element.strokeWidth!;
        ctx.stroke();
    }
}