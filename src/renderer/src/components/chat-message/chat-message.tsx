import './chat-message.css'
import * as React from 'react'

export interface ChatMessageProps {
  className?: string
  children: React.ReactNode
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ className = '', children }) => (
  <div className={`${className} message`}>{children}</div>
)
