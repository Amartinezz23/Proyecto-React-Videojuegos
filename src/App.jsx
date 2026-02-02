import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ListarVideojuegos from './ListarVideojuegos'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ListarVideojuegos></ListarVideojuegos>
    </>
  )
}

export default App
