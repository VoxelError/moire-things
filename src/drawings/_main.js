import { drawing_mode } from "../lib/controls.js"
import heart from "./heart.js"
import circles from "./circles.js"
import pointer from "./pointer.js"
import squares from "./squares.js"
import snake from "./snake.js"
import bounce from "./bounce.js"
import orbs from "./orbs.js"
import pendulums from "./pendulums.js"
import fins from "./fins.js"
import spin from "./spin.js"
import legs from "./legs.js"
import eyes from "./eyes.js"
import larva from "./larva.js"
import twirls from "./twirls.js"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

export const width = canvas.width = window.innerWidth
export const height = canvas.height = window.innerHeight

export let count = 0
const reset_count = () => localStorage.setItem("count", JSON.stringify(0))
const points = JSON.parse(localStorage.getItem("points")) ?? []
export const set_points = (length) => points.length = length
export const reset_points = () => points.length = 0

const skip = (frames) => !(count % frames)
const add_point = (x, y, theta = 0, length = 150) => points.push([x, y, theta, length])

const draw_points = () => {
	if (!cursor.held) return

	if (drawing_mode == 0) return

	if (drawing_mode == 3) {
		add_point(cursor.x, cursor.y - 150)
		return
	}

	if (drawing_mode == 5) {
		add_point(cursor.x, cursor.y)
		cursor.held = false
		return
	}

	if (drawing_mode == 7) {
		add_point(cursor.x, cursor.y, 0, 1)
		return
	}

	if (drawing_mode == 9) {
		add_point(cursor.x, cursor.y, 1, 1)
		return
	}

	add_point(cursor.x, cursor.y)
}

const plot_points = () => {
	if (drawing_mode == 0) {
		for (let i = 0; i < 6; i++) {
			add_point(width / 2, height / 2)
		}
	}

	// if (drawing_mode == 2) {
	// 	for (let i = 0; i < 360; i++) {
	// 		add_point(
	// 			width / 2 + (333 * cos(degrees(i))),
	// 			height / 2 + (333 * sin(degrees(i))),
	// 			-degrees(i)
	// 		)
	// 	}
	// }

	if (drawing_mode == 9) {
		for (let i = 1; i <= 25; i++) {
			add_point(0, 0, i / 50, i / 50)
		}
	}

	cursor.plot = false

	// count < width / 10 ? add_point(count * 10, height - (count ** 1.325)) : cursor.plot = false
	// count <= 45 && add_point(sin_wave(degrees(count * 10), width / 4, width / 2, degrees(45)), (count * 10) + 250)
	// count < height / 2 && skip(5) && add_point(width / 2, height * 0.75 - count)
	// count < width / 4 && skip(5) && add_point(width - count * 4, 0)
	// count < 200 && skip(10) && add_point(width / 2, height / 2)
	// count < 100 && skip(10) && add_point(center.x, center.y - count, 0, count + 200)7
	// count < height && skip(10) && add_point(width / 2 + count, count)
}

export const cursor = {
	x: width - 50,
	y: 50,
	r: 0,
	delta: 0,
	held: false,
	grabbed: true,
	size: 66,
	plot: false,
	pin: {
		x: width / 2 + 200,
		y: height / 2
	}
}

document.addEventListener("mousedown", (e) => {
	e.button == 0 && (cursor.held = true)
	cursor.pin.x = e.pageX
	cursor.pin.y = e.pageY
	// console.log(cursor.pin)
})
document.addEventListener("mouseup", (e) => {
	cursor.held = false
})
document.addEventListener("mousemove", (e) => {
	cursor.x = e.pageX
	cursor.y = e.pageY
})
document.addEventListener("wheel", (e) => {
	// 	e.preventDefault()
	// 	cursor.size += e.deltaY * 0.1
})
document.addEventListener("keydown", (e) => {
	if (e.code == "Backquote") {
		reset_count()
		reset_points()
		cursor.plot = true
		context.clearRect(0, 0, width, height)
		// for (let i = 0; i < 66; i++) { add_point(width / 2, height / 2 + i * 5, 0, i * 5 + 150) }
	}
})

const fade = (alpha) => {
	context.save()
	context.globalAlpha = alpha
	context.fillStyle = "black"
	context.fillRect(0, 0, width, height)
	context.restore()
}

// context.globalCompositeOperation = "xor"

export default () => {
	count = JSON.parse(localStorage.getItem("count"))
	localStorage.setItem("points", JSON.stringify(points))
	cursor.plot && plot_points()
	draw_points()

	context.clearRect(0, 0, width, height)
	// fade(0.25)

	pointer(context)

	switch (drawing_mode) {
		case 0: larva(context, points); break
		case 1: pendulums(context, points); break
		case 2: fins(context, points); break
		case 3: orbs(context, points); break
		case 4: circles(context, points); break
		case 5: eyes(context, points); break
		case 6: spin(context, points); break
		case 7: bounce(context, points); break
		case 8: snake(context, points); break
		case 9: squares(context, points); break

		case 10: legs(context, points); break
		case 11: heart(context); break
		case 12: twirls(context, points); break
	}
}