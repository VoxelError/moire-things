import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import Menu from './components/Menu'
import render from './drawings/_main.js'
import './styles.scss'

const App = () => {
	useEffect(() => {
		!function update() {
			render()
			requestAnimationFrame(update)
		}()
	})

	return <Menu />
}

createRoot(document.getElementById("root")).render(<App />)