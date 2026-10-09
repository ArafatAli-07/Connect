import React from 'react'
import Feed from '../components/Feed'
import Outlet from '../components/Outlet'
import RightSideBar from '../components/RightSideBar'

const page = () => {
  return (
    <div className='flex'>
      <div className='flex'>
        <Feed/>
        <Outlet/>
      </div>
      <RightSideBar/>
    </div>
  )
}

export default page
