import * as React from 'react'
import { createBoard } from '@wixc3/react-board'
import { Player } from '../../../components/player/player'

export default createBoard({
  name: 'Player',
  Board: () => <Player />,
  isSnippet: true
})
