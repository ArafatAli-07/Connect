"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import axios from 'axios'
import { LogOut, UsersRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'


const AccountMenu = () => {
    const router = useRouter();

    const menu = [
        { icon: <LogOut />, text: "Logout" },
        { icon: <UsersRound />, text: "SwitchUser" }
    ]

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                router.replace("/login")
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        if (textType == 'Logout' || textType == "SwitchUser") logoutHandler();
    }



    return (
        <div className='border-gray-200 border min-w-[15vw] p-5 rounded-md mt-5'>

            <div className='flex justify-start items-center gap-2 pb-2'>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="logo" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                    Profile
                    <span className='text-xs text-gray-500'>View your Profile</span>
                </div>
            </div>

            <hr />

            {
                menu.map((item, index) => {
                    return (
                        <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                            {item.icon}
                            <span>{item.text}</span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default AccountMenu
