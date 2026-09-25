'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

const Signup = () => {
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form action="" className='shadow-lg flex flex-col p-8 rounded-2xl bg-black text-white min-h-[75vh] min-w-[35vw]'>
        <div className='my-3 w-full'>
          <Image className='w-50 h-35 mx-auto' src="/logo.png" alt="Logo"  width={100} height={100}/>
          <h1 className='text-center font-bold font-serif'>SignUp</h1>
          <p className='text-center text-gray-300'>Connect with friends and create memories.</p>
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Username</Label>
          <Input
          type='text'
          name='username'
          placeholder='Username'
          className='' 
          />

          <Label className="mt-3">Email</Label>
          <Input
          type='text'
          name='email'
          placeholder='Email'
          className='' 
          />

          <Label className="mt-3">Psssword</Label>
          <Input
          type='text'
          name='password'
          placeholder='Password'
          className='' 
          />
          <Button className='bg-blue-400  border-blue-200 hover:border-2 p-4 font-bold font-serif text-md mt-3'><UserPlus size={18} />Sign Up</Button>
          
          <span className="text-right text-xs text-gray-300 font-serif">
               {"Already have an account?"} <a href="/login" className="underline text-blue-400 mt-4 mr-3 font-bold font-serif">Login</a>
               </span>
        </div>
      </form>
    </div>
  )
}

export default Signup
