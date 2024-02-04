import { createBoard } from '@wixc3/react-board'
import { FilledButton } from '../../../components/filled-button/filled-button'

export default createBoard({
  name: 'FilledButton',
  Board: () => <FilledButton />,
  isSnippet: true
})
