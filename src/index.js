import { drawing_mode, listen } from "./util/controls.js"
import modes from "./util/modes.js"
import './components/App.jsx'
import './styles.scss'

const set_storage = (name, item) => localStorage.setItem(name, JSON.stringify(item))
const get_storage = (name, fallback) => JSON.parse(localStorage.getItem(name)) ?? fallback

const canvas = document.createElement("canvas")
canvas.id = "game_canvas"
document.body.append(canvas)
listen(canvas)

const context = canvas.getContext("2d", { willReadFrequently: true })

const scale = 0.75
window.size = {
	x: canvas.width = window.innerWidth * scale,
	y: canvas.height = window.innerHeight * scale,
}

window.reset = false
window.count = get_storage("count", 0)
window.points = get_storage("points", [])
window.pause = get_storage("pause", false)

const skip = (delay) => count % delay == 0
const fade = (value) => {
	const image_data = context.getImageData(0, 0, canvas.width, canvas.height)
	const pixels = image_data.data
	for (let i = 0; i < pixels.length; i += 4) {
		// for (let j = 0; j < 3; j++) { pixels[i + j] = 255 - pixels[i + j] }
		pixels[i + 3] -= value
	}
	context.putImageData(image_data, 0, 0)
}

!function update() {
	window.pause || window.count++
	set_storage("count", window.count)
	set_storage("points", window.points)
	set_storage("pause", window.pause)
	set_storage("drawing_mode", drawing_mode)

	const no_erase = ["pillar", "stalks"]
	no_erase.includes(drawing_mode) || context.reset()
	// no_erase.includes(drawing_mode) && fade(1)
	// fade(5)

	window.reset && context.reset()
	window.reset = false

	modes(drawing_mode)(window.size, context, window.points, window.count)
	requestAnimationFrame(update)
}()