import React, { useState } from 'react'
import './App.css'
import TailwindBuilder from './components/TailwindBuilder.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Sonata UI</h1>
      <div className="card">
        <TailwindBuilder />
      </div>
    </>
  )
}

export default App
