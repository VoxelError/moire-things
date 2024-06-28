import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.scss'
// import './webgpu/main.js'
// import './webgpu/game_of_life.js'

const root = document.createElement("div")
root.id = "root"
document.body.append(root)
createRoot(root).render(<App />)