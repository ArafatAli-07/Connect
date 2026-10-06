import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, UsersRound } from 'lucide-react'
import React from 'react'

const menu = [
    { icon: <LogOut />, text: "Signout" },
    { icon: <UsersRound />, text: "SwitchUser" }
]
const AccountMenu = () => {
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

            <hr/>

            {
                menu.map((item, index) => {
                    return (
                        <div key={index} className='flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
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
