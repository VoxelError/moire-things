import render from './drawings/_main.js'
import './styles.css'

!function update() {
	render()
	requestAnimationFrame(update)
}()