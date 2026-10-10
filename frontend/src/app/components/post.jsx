import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import React from 'react'

const Post = () => {
  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="logo" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>username</h1>
        </div>
        <Dialog>
          <DialogTrigger>
            <MoreHorizontal className='cursor-pointer'/>
          </DialogTrigger>
          <DialogContent>
            <Button variant='ghost' className="cursor-pointer w-fit font-bold font-serif">unfollow</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Post
