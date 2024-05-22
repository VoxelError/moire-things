import render from './drawings/_main.js'
import './ui/dropdown.js'
import './ui/buttons.js'
import './styles.css'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

!function update() {
	render()
	requestAnimationFrame(update)
}()

// createRoot(document.getElementById("root")).render(
// 	<StrictMode>
// 		<App />
// 	</StrictMode>
// )