import './chat.css'
import * as React from 'react'
import { ChatMessage } from '../chat-message/chat-message'
import { FaFaceLaughWink, FaImage, FaMicrophone } from 'react-icons/fa6'
import { useState } from 'react'

export interface ChatProps {
  className?: string
}

const snowStorm = '#eceff4'

export const Chat: React.FC<ChatProps> = ({ className = '' }) => {
  const [showButtons] = useState(true)
  const [message, setMessage] = useState('')

  return (
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
      <div className="chat-input-container">
        <div className="chat-input">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="chat-input-text"
          />
          {showButtons && (
            <div className="chat-input-buttons">
              <FaMicrophone color={snowStorm} />
              <FaFaceLaughWink color={snowStorm} />
              <FaImage color={snowStorm} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
