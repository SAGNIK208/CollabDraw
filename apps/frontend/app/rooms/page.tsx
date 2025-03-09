import RoomLayout from "../../components/RoomLayout";
import {fetchRooms} from "../../lib/rooms";
import {RoomType } from "@repo/common/types";
import { cookies } from "next/headers";

const RoomsPage = async () => {
    const getCookies = async () => {
      const cookieStore = await cookies();
      return cookieStore.toString();
    };    
    const rooms:RoomType[] = await fetchRooms(await getCookies());
    return (
      <RoomLayout initialRooms={rooms}></RoomLayout>
    );
};

export default RoomsPage;
