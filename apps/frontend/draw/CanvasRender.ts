import {CanvasElementType, Shapes} from "@repo/common/types";
import { CanvasElement } from "../lib/CanvasElement";
import { CanvasElementFactory } from "../lib/CanvasElementFactory";
import {fetchRoomElements} from "../lib/rooms";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export class CanvasRender{

    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private roomId : string;
    private startX = 0;
    private startY = 0;
    private clicked : boolean;
    private existingElements : CanvasElement[] = [];
    private currentElement : Partial<CanvasElementType>  = {};
    private socket : WebSocket;

    constructor(canvas : HTMLCanvasElement,roomId : string,socket: WebSocket){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.roomId = roomId;
        this.clicked = false;
        this.socket = socket;
        this.init();
        this.initMouseHandlers();
        this.socket.onmessage = this.handleIncomingEvent.bind(this);
    }

    async init(){
        try{
            const response = await fetchRoomElements(this.roomId);
            response.map((data:CanvasElementType)=>this.existingElements.push(CanvasElementFactory.createCanvasElement(data)));
            console.log(this.existingElements);
            this.clearCanvas();
        }catch(error){
            if (error instanceof AxiosError && (error.response?.status === 403 || error.response?.status === 401)) {
                console.log("Redirecting to sign-in...");
            }
        }
    }

    private handleIncomingEvent(event: MessageEvent){
        console.log("Message Received");
        const data = JSON.parse(event.data);
        const newElement = CanvasElementFactory.createCanvasElement(data);
        this.existingElements.push(newElement);
        this.clearCanvas();

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
        this.currentElement = {...this.currentElement,x:this.startX,y:this.startY,width:0,height:0};  
        this.currentElement.points = [{
            x:this.startX,
            y:this.startY
        },{
            x:this.startX,
            y:this.startY
        }]
    }

    mouseMoveHandler = (e:MouseEvent) => {
        if(this.clicked){
            this.currentElement!.width = e.clientX - this.startX;
            this.currentElement!.height = e.clientY - this.startY;
            this.currentElement.points = [{
                x:this.startX,
                y:this.startY
            },{
                x:e.clientX,
                y:e.clientY
            }];
            this.clearCanvas();
            const elementInstance = CanvasElementFactory.createCanvasElement(this.currentElement);
            elementInstance.draw(this.ctx);
        }
    }

    mouseUpHandler = (e:MouseEvent) => {
        this.clicked = false;
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;
        this.currentElement = {...this.currentElement,x:this.startX,y:this.startY,width:width,height:height};
        this.currentElement.points = [{
            x:this.startX,
            y:this.startY
        },{
            x:e.clientX,
            y:e.clientY
        }];
        const element : CanvasElement =CanvasElementFactory.createCanvasElement(this.currentElement);
        this.existingElements.push(element);
        this.socket.send(JSON.stringify({type:"ELEMENT",element:element.getElement}));
    }

    doubleClickHandler = (e: MouseEvent) => {
        if (this.currentElement.type !== Shapes.TEXT) return;
    
        const x = e.clientX;
        const y = e.clientY;
        const computedFont = `${this.currentElement.fontSize ?? 16}px Arial`; // Ensure font consistency
        const input = document.createElement("textarea");
        input.style.position = "absolute";
        input.style.left = `${x}px`;
        input.style.top = `${y}px`;
        input.style.fontSize = computedFont;
        input.style.color = this.currentElement.stroke ?? "black";
        input.style.border = "1px dotted black";
        input.style.padding = "4px";
        input.style.background = "transparent";
        input.style.outline = "none";
        input.style.zIndex = "1000";
        input.style.fontFamily = "Arial, sans-serif";
        input.style.resize = "both";
        input.style.overflow = "hidden";
        input.style.minWidth = "50px";
        input.style.minHeight = "30px";
        input.style.whiteSpace = "pre-wrap";
        input.style.wordWrap = "break-word";
    
        document.body.appendChild(input);
        input.focus();
    
        const autoResize = () => {
            input.style.height = "auto";
            input.style.height = `${input.scrollHeight}px`;
            input.style.width = "auto";
            input.style.width = `${input.scrollWidth}px`;
        };
    
        input.addEventListener("input", autoResize);
        autoResize(); 
    
        let isSaved = false;
    
        const saveText = () => {
            if (isSaved || !document.body.contains(input)) return;
            isSaved = true;
    
            const text = input.value.trim();
            if (text) {
                const elementInstance = CanvasElementFactory.createCanvasElement({
                    type: Shapes.TEXT,
                    x,
                    y,
                    text,
                    fontSize: this.currentElement.fontSize ?? 16,
                    stroke: this.currentElement.stroke ?? "black",
                    width: input.offsetWidth,
                    height: input.offsetHeight,
                    points:[],
                    strokeWidth: this.currentElement.strokeWidth,
                    fill: this.currentElement.fill
                });
                this.existingElements.push(elementInstance);
                this.socket.send(JSON.stringify({type:"ELEMENT",element:elementInstance.getElement}));
                this.clearCanvas();
            }
            document.body.removeChild(input);
        };
    
        input.addEventListener("blur", saveText);
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                saveText();
            }
        });
    };
    
    initMouseHandlers(){
        this.canvas.addEventListener("mousedown",this.mouseDownHandler);
        this.canvas.addEventListener("mouseup",this.mouseUpHandler);
        this.canvas.addEventListener("mousemove",this.mouseMoveHandler);
        this.canvas.addEventListener("dblclick", this.doubleClickHandler);
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    }


}