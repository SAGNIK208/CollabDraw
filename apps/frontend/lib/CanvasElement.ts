import { CanvasElementType } from "@repo/common/types"

export abstract class CanvasElement {
    protected element:Partial<CanvasElementType>;

    constructor(data:Partial<CanvasElementType>){
        this.element = data;
    }

    abstract draw(context:CanvasRenderingContext2D) : void;

}