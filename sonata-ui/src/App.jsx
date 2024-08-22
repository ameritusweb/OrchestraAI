import React, { useState } from 'react'
import './App.css'
import TailwindBuilder from './components/TailwindBuilder.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <div className="card-header">Sonata UI</div>
        <TailwindBuilder />
      </div>
    </>
  )
}

export default App
