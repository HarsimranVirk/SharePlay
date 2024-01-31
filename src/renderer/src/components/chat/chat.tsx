import './chat.css'
import * as React from 'react'
import { ChatMessage } from '../chat-message/chat-message'

export interface ChatProps {
  className?: string
}

export const Chat: React.FC<ChatProps> = ({ className = '' }) => (
  <div className={`${className} chat-container`}>
    <div className="messages-container">
      <div className="scroll-container">
        <ChatMessage className="yours" />
        <ChatMessage className="yours" />
        <ChatMessage className="yours" />
        <ChatMessage className="yours" />
        <ChatMessage className="mine last" />
        <ChatMessage className="yours" />
        <ChatMessage className="yours" />
        <ChatMessage className="last yours" />
      </div>
    </div>
    <div className="chat-input">
      <textarea rows={1} className="chat-text-input" />
    </div>
  </div>
)
