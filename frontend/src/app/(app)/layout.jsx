import React from 'react'
import LeftSideBar from '../components/LeftSideBar'

export default function layout ({children}){
  return (
    <div>
      <LeftSideBar/>
      {children}
    </div>
  )
}