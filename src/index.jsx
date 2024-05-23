import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import render from './drawings/_main.js'
import './ui/dropdown.js'
import './ui/buttons.js'
import './styles.scss'

!function update() {
	render()
	requestAnimationFrame(update)
}()

// createRoot(document.getElementById("root")).render(
// 	<StrictMode>
// 		<App />
// 	</StrictMode>
// )