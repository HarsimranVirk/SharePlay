import './input.css'
import * as React from 'react'
export interface InputProps {
  className?: string
  children?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({ className = '', children }) => {
  return <input className="nord-input">{children}</input>
}
