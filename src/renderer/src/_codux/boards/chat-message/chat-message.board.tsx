import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { ChatMessage } from '../../../components/chat-message/chat-message';

export default createBoard({
    name: 'ChatMessage',
    Board: () => <ChatMessage />,
    isSnippet: true,
});
