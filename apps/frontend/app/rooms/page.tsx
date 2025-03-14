import { AxiosError } from "axios";
import RoomLayout from "../../components/RoomLayout";
import {fetchRooms} from "../../lib/rooms";
import {RoomType } from "@repo/common/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const RoomsPage = async () => {
    const getCookies = async () => {
      const cookieStore = await cookies();
      return cookieStore.toString();
    };    
    try {
      const rooms:RoomType[] = await fetchRooms(await getCookies());
      return (
        <RoomLayout initialRooms={rooms}></RoomLayout>
      );
    } catch (error) {
      if (error instanceof AxiosError && (error.response?.status === 403 || error.response?.status === 401)) {
        console.log("Redirecting to sign-in...");
        redirect("/signin");
      } else {
        <RoomLayout initialRooms={[]}></RoomLayout>
      }
    }
};

export default RoomsPage;
