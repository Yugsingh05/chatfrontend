"use client";
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      if (!currentUser || !currentUser.email) {
        router.push("/login");
        return;
      }

      try {
        const res = await axios.post(CHECK_USER_ROUTE, { email: currentUser.email });

        if (!res.data.status) {
          router.push("/register");
          return;
        }

        setData({
          id: res.data.data.id,
          name: res.data.data.name,
          email: res.data.data.email,
          profileImage: res.data.data.profileImage,
          about: res.data.data.about,
          status: true,
          isNewUser: false,
        });
      } catch (error) {
        console.log("Error checking user:", error);
        router.push("/login");
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [router, setData]);

  return (
    <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-screen overflow-hidden">
      <ChatList />
      <Empty />
    </div>
  );
}
