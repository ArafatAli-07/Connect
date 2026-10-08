'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { Loader2, LogIn } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

const Signup = () => {

  const [input, setinput] = useState({
    email: "",
    password: "",
  });

  const [loading, setloading] = useState(false)

  const changeEventHandler = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  }

  const router = useRouter();

  const loginHandler = async (e) => {
    e.preventDefault();
    // console.log(input);
    try {
      setloading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        router.replace("/")
        setinput({
          email: "",
          password: ""
        })
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setloading(false);
    }
  }

  return (
    <div className='flex items-center w-screen h-screen justify-center bg-black'>
      <form onSubmit={loginHandler} className='shadow-sm shadow-blue-400 flex flex-col p-8 rounded-2xl bg-black text-white min-h-[80vh] min-w-[35vw] max-w-[90vw] md:min-w-[40vw]'>
        <div className='my-3 w-full'>
          <Image className='w-50 h-35 mx-auto' src="/logo.png" alt="Logo" width={100} height={100} />
          <h1 className='text-center text-xl font-bold font-serif'>LogIn</h1>
          <p className='text-center text-gray-300 my-2'>Connect with friends and create memories.</p>
        </div>
        <div className='flex flex-col gap-3'>

          <Label className="mt-3">Email</Label>
          <Input
            type='email'
            name='email'
            value={input.email}
            onChange={changeEventHandler}
            placeholder='Email'
            required
          />

          <Label className="mt-3">Psssword</Label>
          <Input
            type='password'
            name='password'
            value={input.password}
            onChange={changeEventHandler}
            placeholder='Password'
            required
          />
          {
            loading ? (
              <Button disabled={loading} type="submit" className="bg-blue-400 hover:bg-blue-400 border-blue-200 hover:border-2 p-4 font-bold font-serif text-md mt-3"><Loader2 className="animate-spin" />Loading...</Button>)
              : (
                <Button type="submit" className="bg-blue-400 border-blue-200 hover:border-2 p-4 font-bold font-serif text-md mt-3"><LogIn size={18} />Login</Button>)
          }

          <span className="text-right text-xs text-gray-300 font-serif">
            {"Doesn't have an account?"} <a href="/signup" className="underline text-blue-400 mt-4 mr-3 font-bold font-serif">Signup</a>
          </span>
        </div>
      </form>
    </div>
  )
}

export default Signup
