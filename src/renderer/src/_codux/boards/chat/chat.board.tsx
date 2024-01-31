import * as React from 'react';
import { createBoard } from '@wixc3/react-board';
import { Chat } from '../../../components/chat/chat';

export default createBoard({
    name: 'Chat',
    Board: () => <Chat />,
    isSnippet: true,
});
