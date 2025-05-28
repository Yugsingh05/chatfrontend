"use client";
import Avatar from "@/components/Avatar";
import Input from "@/components/Input";
import { user, useStateProvider } from "@/context/StateContext";
import { REGISTER_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Register = () => {
  const { data,setData }: { data: user , setData : React.Dispatch<React.SetStateAction<user>> } = useStateProvider();
  const [name, setName] = useState(data?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState( data?.profileImage || "/default_avatar.png");
  const router = useRouter();

  useEffect(() => {
    console.log("data", data);
    if(!data?.email){
      router.push("/login")

    }
  }, []);

    const handleCreate = async() => {

      const email = data?.email;

      if(!email || !name || !about || !image) return alert("All fields are required");
      try {
        const res = await axios.post(REGISTER_USER_ROUTE, { email, name, about, image });
        console.log(res.data);
        setData({
          id: data.id,
          name,
          email,
          about,
          profileImage: image,
          status: true,
          isNewUser: true
        })
        if(res.data.status) router.push("/");
      } catch (error) {
        console.error(error)
      }
    
    };


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
            name={"Display Name"}
            state={name}
            setState={setName}
            label={true}
          />
          <Input
          
            name={"about"}
            state={about}
            setState={setAbout}
            label={true}
          />

          <div className="flex items-center justify-center">
            <button className="flex items-center justify-center gap-7 bg-black text-white py-2 px-4  rounded-lg cursor-pointer" onClick={handleCreate}>
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type={"xl"} image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
};

export default Register;
