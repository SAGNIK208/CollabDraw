import RoomCanvas from "../../../components/RoomCanvas";

interface Params{
    roomId:string
}

export default async function CanvasPage({ params }:{params: Promise<Params>}) {
    const roomId = (await params).roomId;
    return <RoomCanvas roomId={roomId}/>
   
}

