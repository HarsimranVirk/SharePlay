import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'

function App() {
  return (
    <>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>
    </>
  )
}

export default App
