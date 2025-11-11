import React from 'react'
import logo from '../assets/bird_2.jpg'

export default function Logo({wrapperStyling, imgStyling="w-25"}) {
  return (
    <div className={wrapperStyling}>
        <img src={logo} alt="Logo"
        className={imgStyling}/>
    </div>
  )
}
