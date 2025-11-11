import React from 'react'
import image from '../assets/bird_2.jpg'

function Logo({width = '100px'}) {
  return (
    <div>
      <img src={image} alt="Logo" />
    </div>
  )
}

export default Logo