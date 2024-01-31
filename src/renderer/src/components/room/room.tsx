import './room.css'
import { Input } from '../input/input'
import { FilledButton } from '../filled-button/filled-button'
import * as React from 'react'
import { Chat } from '../chat/chat'
export interface RoomProps {
  className?: string
}

export const Room: React.FC<RoomProps> = ({ className = '' }) => (
  <div className="room">
    <div className="users" />
    <div className="chat">
      <Chat />
      <div className="center hide">
        <div className="server-input">
          <Input></Input>
          <div className="button-group">
            <FilledButton>Join</FilledButton>
            <FilledButton>Host</FilledButton>
          </div>
        </div>
      </div>
    </div>
  </div>
)
