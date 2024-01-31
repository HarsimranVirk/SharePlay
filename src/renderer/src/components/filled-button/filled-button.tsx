import './filled-button.css'
import * as React from 'react'
export interface FilledButtonProps {
  className?: string
  children?: React.ReactNode
}

export const FilledButton: React.FC<FilledButtonProps> = ({ className = '', children }) => (
  <button className="filled-button">{children}</button>
)
