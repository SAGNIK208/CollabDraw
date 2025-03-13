import {CanvasElementType, Shapes} from "@repo/common/types";
import { CanvasElement } from "../lib/CanvasElement";
import { CanvasElementFactory } from "../lib/CanvasElementFactory";

export class CanvasRender{

    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private roomId : string;
    private startX = 0;
    private startY = 0;
    private clicked : boolean;
    private existingElements : CanvasElement[] = [];
    private currentElement : Partial<CanvasElementType>  = {};

    constructor(canvas : HTMLCanvasElement,roomId : string){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.roomId = roomId;
        this.clicked = false;
        this.init();
        this.initMouseHandlers();
    }

    async init(){
       console.log(this.existingElements);
    }

    applyElementUpdate(element:CanvasElementType){
        this.currentElement = element;
        console.log(this.currentElement);
    }

    clearCanvas(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.ctx.strokeStyle = "rgba(0,0,0)"
        this.existingElements.map((element)=>element.draw(this.ctx));
    }

    mouseDownHandler = (e:MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.currentElement = {
            type: Shapes.RECTANGLE,
            x: this.startX,
            y: this.startY,
            width: 0,
            height: 0,
            stroke: "black",
            fill: "transparent",
            strokeWidth: 2,
            fontSize: 16,
            text: null,
            points: [],
          };
      
    }

    mouseMoveHandler = (e:MouseEvent) => {
        if(this.clicked){
            this.currentElement!.width = e.clientX - this.startX;
            this.currentElement!.height = e.clientY - this.startY;
            this.clearCanvas();
            const elementInstance = CanvasElementFactory.createCanvasElement(this.currentElement);
            elementInstance.draw(this.ctx);
        }
    }

    mouseUpHandler = (e:MouseEvent) => {
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        const rect : CanvasElementType = {
            type:Shapes.RECTANGLE,
            x:this.startX,
            y:this.startY,
            width:width,
            height:height,
            points:[
                { x: this.startX, y: this.startY },
                { x: e.clientX, y: e.clientY },
              ]
        }
        const element : CanvasElement =CanvasElementFactory.createCanvasElement(rect);
        this.existingElements.push(element);
    }

    initMouseHandlers(){
        this.canvas.addEventListener("mousedown",this.mouseDownHandler);
        this.canvas.addEventListener("mouseup",this.mouseUpHandler);
        this.canvas.addEventListener("mousemove",this.mouseMoveHandler);
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }


}