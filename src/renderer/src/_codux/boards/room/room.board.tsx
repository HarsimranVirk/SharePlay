import { createBoard } from '@wixc3/react-board'
import { Room } from '../../../components/room/room'

export default createBoard({
  name: 'Room',
  Board: () => <Room />,
  isSnippet: true,
  environmentProps: {
    canvasWidth: 484,
    canvasHeight: 301
  }
})
