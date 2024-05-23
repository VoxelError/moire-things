import { cursor, draw_points, drawing_mode } from "../lib/controls.js"

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
import eyes from "./petals.js"
import larva from "./larva.js"
import twirls from "./twirls.js"
import sun from "./sun.js"
import sphere from "./sphere.js"
import stare from "./stare.js"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

export const width = window.innerWidth
export const height = window.innerHeight

canvas.width = width
canvas.height = height

let count = JSON.parse(localStorage.getItem("count")) ?? 0
const points = JSON.parse(localStorage.getItem("points")) ?? []

export const add_count = (value = 1) => { count += value }
export const reset_count = () => { count = 0 }
export const reset_points = () => { points.length = 0 }
export const add_point = (x, y, theta = 0, length = 150) => { points.push([x, y, theta, length]) }

// const fade = (alpha) => {
// 	context.save()
// 	context.globalAlpha = alpha
// 	context.fillStyle = "black"
// 	context.fillRect(0, 0, width, height)
// 	context.restore()
// }

// context.globalCompositeOperation = "xor"

export default () => {
	add_count()
	localStorage.setItem("count", JSON.stringify(count))
	localStorage.setItem("points", JSON.stringify(points))
	localStorage.setItem("drawing_mode", JSON.stringify(drawing_mode))
	draw_points()

	switch (drawing_mode) {
		case "Fins": plot_button.style.color = "white"; break
		case "Squares": plot_button.style.color = "white"; break
		case "Sun": plot_button.style.color = "white"; break
		default: plot_button.style.color = "grey"; break
	}

	context.clearRect(0, 0, width, height)
	// fade(0.25)
	cursor.show && pointer(context)

	switch (drawing_mode) {
		case "Bounce": bounce(context, points); break
		case "Circles": circles(context, points); break
		case "Fins": fins(context, points); break
		case "Heart": heart(context, count); break
		case "Larva": larva(context, count); break
		case "Legs": legs(context, points); break
		case "Orbs": orbs(context, points); break
		case "Pendulums": pendulums(context, points); break
		case "Petals": eyes(context, points); break
		case "Snake": snake(context, points); break
		case "Sphere": sphere(context, count); break
		case "Spin": spin(context, points, count); break
		case "Squares": squares(context, points); break
		case "Stare": stare(context, count); break
		case "Sun": sun(context, points, count); break
		case "Twirls": twirls(context, points); break
	}
}