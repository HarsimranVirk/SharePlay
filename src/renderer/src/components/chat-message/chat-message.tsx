import './chat-message.css'
import * as React from 'react'

export interface ChatMessageProps {
  className?: string
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ className = '' }) => (
  <div className={`${className} message`}>Text</div>
)
