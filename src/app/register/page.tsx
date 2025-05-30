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
  const { data, setData }: { data: user; setData: React.Dispatch<React.SetStateAction<user>> } = useStateProvider();
  const [name, setName] = useState(data?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(data?.profileImage || "/default_avatar.png");
  const router = useRouter();

  useEffect(() => {
    if (!data.email) {
      router.push("/login");
    }
  }, [data, router]);

  const handleCreate = async () => {
    const email = data?.email;
    if (!email || !name || !about || !image) return alert("All fields are required");
    try {
      const res = await axios.post(REGISTER_USER_ROUTE, { email, name, about, image });
      setData({
        id: data.id,
        name,
        email,
        about,
        profileImage: image,
        status: true,
        isNewUser: true,
      });
      if (res.data.status) router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-panel-header-background min-h-screen w-full flex items-center justify-center text-white px-4 py-8">
      <div className="flex flex-col items-center text-center gap-4 max-w-5xl w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full">
          <div className="flex items-center justify-center gap-2">
             <Image
                        src="/logo.png"
                        alt="logo"
                        width={150}
                        height={150}
                        style={{ objectFit: "contain" }}
                        priority
                      />
            <span className="text-4xl md:text-6xl font-bold select-none -mt-5">converssa</span>
          </div>
        </div>

        <h2 className="text-xl md:text-2xl font-semibold">Create your profile</h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-6 w-full max-w-4xl">
          {/* Inputs */}
          <div className="flex flex-col gap-6 w-full max-w-md">
            <Input name="Display Name" state={name} setState={setName} label={true} />
            <Input name="About" state={about} setState={setAbout} label={true} />
          </div>

          {/* Avatar */}
          <div className="flex justify-center">
            <Avatar type="xl" image={image} setImage={setImage} />
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="bg-black text-white py-3 px-8 mt-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 w-full max-w-xs"
        >
          Create Profile
        </button>
      </div>
    </div>
  );
};

export default Register;
