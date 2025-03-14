import { CanvasElementType } from "@repo/common/types";
import { CanvasElement } from "./CanvasElement";

export class EllipseElement extends CanvasElement {
    constructor(data: CanvasElementType) {
        super(data);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.element.x || !this.element.y || !this.element.width || !this.element.height) return;

        const centerX = this.element.x + this.element.width / 2;
        const centerY = this.element.y + this.element.height / 2;
        const radiusX = Math.abs(this.element.width / 2);
        const radiusY = Math.abs(this.element.height / 2);

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.fillStyle = this.element.fill ?? "transparent";
        ctx.fill();
        ctx.strokeStyle = this.element.stroke!;
        ctx.lineWidth = this.element.strokeWidth!;
        ctx.stroke();
    }
}
