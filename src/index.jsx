import React, { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import pendulums from './drawings/pendulums.js'
import circles from './drawings/circles.js'
import count from './reducers/count.js'

const store = configureStore({ reducer: { count } })

!function update() {
	const count = JSON.parse(localStorage.getItem("count")) ?? 0
	localStorage.setItem("count", JSON.stringify(count + 1))

	pendulums()
	requestAnimationFrame(update)
}()

const App = () => {
	useEffect(() => { })
}

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>
)