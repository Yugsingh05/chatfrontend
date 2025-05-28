"use client"

import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/firebaseconfig";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const StateContext = createContext<{
  data: user;
  setData: React.Dispatch<React.SetStateAction<user>>;
  handleLogout: () => void;
} | undefined>(undefined);

export type user = {
    id : string,
    name : string,
    email : string,
    profileImage : string,
    about : string,
    status : boolean,
    isNewUser : boolean

}
export const StateProvider = ({children} : {children : React.ReactNode})  => {
    const [data,setData] = useState<user>({
        id :"",
        name : "",
        email : "",
        profileImage : "",
        about : "",
        status : false,
        isNewUser : true
    });
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
        console.log(res.data);

        setData({
          id: res.data.data.id || "",
          name: res.data.data.name || "",
          email: res.data.data.email || "",
          profileImage: res.data.data.profileImage || "",
          about: res.data.data.about || "",
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


  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut();
      setData({
        id: "",
        name: "",
        email: "",
        profileImage: "",
        about: "",
        status: false,
        isNewUser: true,
      });
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <StateContext.Provider value={{ data, setData ,handleLogout}}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateProvider = (): { data: user; setData: React.Dispatch<React.SetStateAction<user>>, handleLogout : () => void } => {

    const context =  useContext(StateContext);
    if(!context){
        throw new Error("useStateProvider must be used within a StateProvider")
    }
    return context
}