"use client"
import { useStateProvider } from "@/context/StateContext";
import { useEffect } from "react";

export default function Home() {

  const {data} = useStateProvider()

  useEffect(() => {console.log(data)}, []);
  return (
   <div className="text-teal-light">Home</div>
  );
}
