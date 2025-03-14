import { CanvasElementType } from "@repo/common/types"

export abstract class CanvasElement {
    protected element:Partial<CanvasElementType>;

    constructor(data:Partial<CanvasElementType>){
        this.element = data;
    }
    
    get getElement(): Partial<CanvasElementType> {
        return this.element;
    }

    abstract draw(context:CanvasRenderingContext2D) : void;

}