"use client"
import { useStateProvider } from '@/context/StateContext'
import Image from 'next/image'
import React, { useEffect } from 'react'

const Register = () => {

  const {data} = useStateProvider();

  useEffect(() => {console.log("data" , data);}, []);
  return (
    <div className='bg-panel-header-background h-screen w-screen flex flex-col items-center text-white'>
<div className="flex items-center justify-center gap-2">
  <Image src={"/whatsapp.gif"} width={300} height={300} alt={"whatsapp"}/>
  <span className='text-7xl'>Whatsapp</span>
</div>
<h2 className='text-2xl'>Create your profile</h2>
<div className="flex gap-6 mt-6">
  <div className="flex flex-col items-center justify-center mt-6 gap-6">
    
  </div>
</div>

    </div>
  )
}

export default Register