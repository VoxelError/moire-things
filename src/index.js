import render from './drawings/_main.js'
import './styles.css'

!function update() {
	const count = JSON.parse(localStorage.getItem("count")) ?? 0
	localStorage.setItem("count", JSON.stringify(count + 1))

	render()
	requestAnimationFrame(update)
}()