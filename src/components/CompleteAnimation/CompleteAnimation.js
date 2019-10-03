import React from 'react'
import Checkmark from './Checkmark/Checkmark'
import Fireworks from './Fireworks/Fireworks'
import './CompleteAnimation.scss'

export default function CompleteAnimation() {
  return (
    <div className="CompleteAnimationBG">
      <Fireworks />
      <Checkmark />
    </div>
  )
}