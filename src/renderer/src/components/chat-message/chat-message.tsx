import './chat-message.css'
import * as React from 'react'

export interface ChatMessageProps {
  className?: string
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ className = '' }) => (
  <div className={`${className} message`}>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet quisquam eum in, quos architecto
    illum? Voluptates quos eligendi aperiam vitae!
  </div>
)
