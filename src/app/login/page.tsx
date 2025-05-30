"use client";

import { firebaseAuth } from '@/utils/firebaseconfig'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { FcGoogle } from "react-icons/fc"
import axios from 'axios'
import { CHECK_USER_ROUTE } from '@/utils/ApiRoutes'
import { useRouter } from 'next/navigation';
import { useStateProvider } from '@/context/StateContext';

const Page = () => {
  const router = useRouter();
  const { data, setData } = useStateProvider();
  if (!setData) {
    throw new Error("setData is not defined in StateContext");
  }

  useEffect(() => {
    if (data?.id) {
      router.push("/");
    }
  }, [data, router]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(firebaseAuth, provider);

      const { email, photoURL, displayName } = user;

      if (email) {
        const { data: resData } = await axios.post(CHECK_USER_ROUTE, { email });

        if (!resData.status) {
          setData({
            id: "", // or generate a temporary id if needed
            name: displayName || "",
            email,
            profileImage: photoURL || "",
            status: false,
            about: "", // or provide a default value
            isNewUser: true,
          });
          router.push("/register");
        } else {
          setData({
            id: resData.data.id,
            name: displayName || "",
            email,
            profileImage: photoURL || "",
            status: true,
            about: resData.data.about,
            isNewUser: false,
          });
          router.push("/");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-panel-header-background gap-6">
      {/* Responsive container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-4xl">
        <div className="relative w-48 h-48 md:w-72 md:h-72 flex-shrink-0">
          <Image
            src="/whatsapp.gif"
            alt="whatsapp"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <h1 className="text-white text-4xl md:text-7xl font-bold select-none">
          Whatsapp
        </h1>
      </div>

      <button
        onClick={handleLogin}
        className="flex items-center justify-center gap-3 bg-search-input-container-background hover:bg-search-input-container-background-hover transition-colors duration-200 px-6 py-4 rounded-lg shadow-md max-w-xs w-full md:max-w-sm"
        aria-label="Sign in with Google"
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-lg md:text-2xl font-semibold">
          Sign in with Google
        </span>
      </button>
    </div>
  );
};

export default Page;
