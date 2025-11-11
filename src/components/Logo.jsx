import React from 'react'
import image from '../assets/bird_2.jpg'

function Logo({width = 'w-25'}) {
  return (
    <div>
      <img src={image} alt="Logo" className={`${width}`} />
    </div>
  )
}

export default Logo