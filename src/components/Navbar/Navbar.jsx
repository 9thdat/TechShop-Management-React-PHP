import React from 'react';

import { IoMdNotificationsOutline } from 'react-icons/io';

export default function Navbar() {
  return (
    <div className="navbar grid grid-cols-6 h-full w-full">
      <div className="current-menu w-full h-full col-start-1 col-end-2 flex items-center justify-center ">
        <span className='font-bold text-2xl'>TRANG CHÍNH</span>
      </div>

      <div className="notification w-full h-full col-start-5 col-end-6 flex items-center justify-endr">
        <IoMdNotificationsOutline className='w-5 h-5' />
      </div>

      <div className="user w-full h-full col-start-6 col-end-7 flex items-center justify-center">
        <div className="user-avatar w-14 h-14 border border-black mr-3">

        </div>
        <div className="user-name">
          <span>Nguyễn Văn A</span>
        </div>
      </div>
    </div>
  )
}