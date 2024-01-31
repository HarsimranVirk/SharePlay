import { createBoard } from '@wixc3/react-board'
import { Home } from '../../../components/home/home'

export default createBoard({
  name: 'Home',
  Board: () => <Home />,
  isSnippet: true,
  environmentProps: {
    windowWidth: 1164,
    windowHeight: 578,
    canvasHeight: 5
  }
})
