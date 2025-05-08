"use client";
import Avatar from "@/components/Avatar";
import Input from "@/components/Input";
import { user, useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Register = () => {
  const { data }: { data: user } = useStateProvider();
  const [name, setName] = useState(data?.name || "");
  const [emaill, setEmail] = useState(data?.email || "");
  const [image, setImage] = useState("/default_avatar.png");

  useEffect(() => {
    console.log("data", data);
  }, []);
  return (
    <div className="bg-panel-header-background h-screen w-screen flex flex-col items-center justify-center text-white">
      <div className="flex items-center justify-center gap-2">
        <Image
          src={"/whatsapp.gif"}
          width={300}
          height={300}
          alt={"whatsapp"}
        />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <h2 className="text-2xl">Create your profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input
            name={"DIsplay Name"}
            state={name}
            setState={setName}
            label={true}
          />
          <Input
            name={"Email"}
            state={emaill}
            setState={setEmail}
            label={true}
          />
        </div>
        <div>
          <Avatar type={"xl"} image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
};

export default Register;
