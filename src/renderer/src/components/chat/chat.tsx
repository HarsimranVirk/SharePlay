import './chat.css'
import * as React from 'react'
import { ChatMessage } from '../chat-message/chat-message'
import { FaFaceLaughWink, FaImage, FaMicrophone } from 'react-icons/fa6'
import { useEffect, useRef, useState } from 'react'

export interface ChatProps {
  className?: string
}

const snowStorm = '#eceff4'

export const Chat: React.FC<ChatProps> = ({ className = '' }) => {
  const [me] = useState('Harsi')
  const [message, setMessage] = useState('')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const [messages, setMessages] = useState([
    { text: 'Hello', by: 'Harsi' },
    { text: 'Hiiiiii', by: 'Alisha' }
  ])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className={`${className} chat-container`}>
      <div className="messages-container">
        <div className="scroll-container" ref={scrollContainerRef}>
          {messages.map(({ text, by }) => (
            <ChatMessage key={text + '-' + by} className={`${by === me ? 'mine' : 'yours'}`}>
              {text}
            </ChatMessage>
          ))}
        </div>
      </div>
      <div className="chat-input-container">
        <div className="chat-input">
          <textarea
            value={message}
            ref={textAreaRef}
            onKeyDown={(e) => {
              e.stopPropagation()
              if (e.code === 'Enter' && message !== '' && textAreaRef.current) {
                textAreaRef.current.style.height = '16px'
                setMessages((m) => [...m, { text: message, by: me }])
                setMessage('')
              }
            }}
            onChange={(e) => {
              if (e.target.value.includes('\n')) {
                setMessage('')
                return
              }
              setMessage(e.target.value)
              if (textAreaRef.current) {
                textAreaRef.current.style.height = '16px'
                const newHeight = textAreaRef.current.scrollHeight - 16
                textAreaRef.current.style.height = (newHeight <= 200 ? newHeight : 200) + 'px'
              }
            }}
            className="chat-input-text"
          />
          <div className="chat-input-buttons">
            <FaMicrophone color={snowStorm} />
            <FaFaceLaughWink color={snowStorm} />
            <FaImage color={snowStorm} />
          </div>
        </div>
      </div>
    </div>
  )
}
