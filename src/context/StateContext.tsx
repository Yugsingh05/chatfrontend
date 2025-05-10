"use client"

import { createContext, useContext, useState } from "react";

export const StateContext = createContext({});

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
    return (
        <StateContext.Provider value={{ data, setData }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateProvider = () => {

    const context =  useContext(StateContext);
    if(!context){
        throw new Error("useStateProvider must be used within a StateProvider")
    }
    return context
}