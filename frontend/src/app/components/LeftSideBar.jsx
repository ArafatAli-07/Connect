import { Heart, Home, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import AccountMenu from "../components/AccountMenu";



const LeftSideBar = () => {

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },

  ]

  return (
    <div className='px-4 border w-[20%] h-[95vh] m-4 rounded-xl'>
      <div className=' flex flex-col items-center '>
        <h1>
          <Image className='w-60 h-35 mx-auto' src="/logo.png" alt="Logo" width={100} height={100} />
        </h1>
        <div>
          {
            sidebarItems.map((item, index) => {
              return (
                <div key={index} className='flex items-center gap-2 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              )
            })
          }
          <AccountMenu />
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar
