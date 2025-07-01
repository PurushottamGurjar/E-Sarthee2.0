import { useState } from 'react'
import './App.css'
import ESarthee from './components/E-Sarthee'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ESarthee/>
    </>
  )
}

export default App
