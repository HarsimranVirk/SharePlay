import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Player from './components/Player'
import { createContext, useState } from 'react'

const HostContext = createContext(false)

function App() {
  const [host, setHost] = useState(false)
  return (
    <>
      <HostContext.Provider value={{ host, setHost }}>
        <MemoryRouter>
          <Routes>
            <Route path="/player" element={<Home />} />
            <Route path="/" element={<Player />} />
          </Routes>
        </MemoryRouter>
      </HostContext.Provider>
    </>
  )
}

export default App
export { HostContext }
