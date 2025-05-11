"use client";
import Chat from "@/components/Chat/Chat";
import ChatList from "@/components/ChatList";
import Empty from "@/components/Empty";
import { useStateProvider } from "@/context/StateContext";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/firebaseconfig";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data, setData } = useStateProvider();
  const router = useRouter();

  

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ChatList />
      {/* <Empty /> */}
      <Chat/>
    </div>
  );
}
