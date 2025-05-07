"use client";

import { firebaseAuth } from '@/utils/firebaseconfig'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Image from 'next/image'
import React from 'react'
import { FcGoogle } from "react-icons/fc"
import axios from "axios"
import { CHECK_USER_ROUTE } from '@/utils/ApiRoutes'
import { useRouter } from 'next/navigation';
import { useStateProvider } from '@/context/StateContext';


const Page = () => {

  const router = useRouter();
  const { data, setData } = useStateProvider()

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(firebaseAuth, provider);

    const { email, photoURL, displayName } = user

    try {

      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });
        console.log(data)
        if (!data.status)
          setData({
            name: displayName,
            email,
            profileImage: photoURL,
            status: false,
          })
        router.push("/register")
      }

    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className='flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6'>
      <div className='flex items-center justify-center gap-2 text-white'>
        <Image src={"/whatsapp.gif"} width={300} height={300} alt={"whatsapp"} />
        <span className='text-7xl'>Whatsapp</span>
      </div>
      <button className='flex items-center justify-center gap-2 bg-search-input-container-background  p-4 rounded-lg' onClick={handleLogin}>
        <FcGoogle className='text-4xl' />
        <span className='text-white text-2xl'>Sign in with Google</span>
      </button>


    </div>
  )
}

export default Page