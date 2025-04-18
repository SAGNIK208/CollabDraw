import { CanvasElementType } from "@repo/common/types";
import { CanvasElement } from "./CanvasElement";

export class TextElement extends CanvasElement{
    constructor(data:CanvasElementType){
        super(data);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.element.text) return;    
        ctx.font = `${this.element.fontSize ?? 16}px Arial`;
        ctx.fillStyle = this.element.stroke!;   
        const lines = this.element.text.split("\n");
        const lineHeight = this.element.fontSize ?? 16;
        lines.forEach((line, index) => {
            ctx.fillText(line, this.element.x!, this.element.y! + index * lineHeight);
        });
    }    
}