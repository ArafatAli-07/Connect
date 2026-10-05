import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const sidebarItems = [
  { icon: <Home />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUp />, text: "Explore" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notification" },
  { icon: <PlusSquare />, text: "Create" },
  {
    icon: (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="logo" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ), text: "Profile"
  },
  { icon: <LogOut />, text: "Logout" },
]

const LeftSideBar = () => {
  return (
    <div className='px-4 border-r border-gray-300 w-[18%] h-screen'>
      <div className=' flex flex-col items-center '>
        <h1>
          <Image className='w-50 h-35 mx-auto' src="/logo.png" alt="Logo" width={100} height={100} />
          </h1>
        <div>
          {
            sidebarItems.map((item, index) => {
              return (
                 <div key={index} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                  {item.icon}
                  <span>{item.text}</span>
                 </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar
