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
        this.drawArrowhead(ctx, start!, end!);
    }

    private drawArrowhead(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, end: { x: number; y: number }) {
        const arrowSize = Math.max(10, this.element.strokeWidth! * 2); // Arrow size scales with stroke width
        const angle = Math.atan2(end.y - start.y, end.x - start.x);

        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
            end.x - arrowSize * Math.cos(angle - Math.PI / 6),
            end.y - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            end.x - arrowSize * Math.cos(angle + Math.PI / 6),
            end.y - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = this.element.stroke!;
        ctx.fill();
    }
}