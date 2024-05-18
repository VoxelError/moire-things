import { draw_points, drawing_mode, plot_points } from "../lib/controls.js"
import { cos, degrees, pi, sin } from "../lib/math.js"

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
import sun from "./sun.js"
import sphere from "./sphere.js"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

export const width = canvas.width = window.innerWidth
export const height = canvas.height = window.innerHeight

export let count = 0
const reset_count = () => localStorage.setItem("count", JSON.stringify(0))
const points = JSON.parse(localStorage.getItem("points")) ?? []
const set_points = (length) => points.length = length
const reset_points = () => points.length = 0

const skip = (frames) => !(count % frames)
export const add_point = (x, y, theta = 0, length = 150) => points.push([x, y, theta, length])

export const cursor = {
	x: width - 50,
	y: 50,
	r: 0,
	delta: 0,
	held: false,
	grabbed: true,
	size: 66,
	plot: false,
	menu: false,
	pin: {
		x: width / 2 + 200,
		y: height / 2
	}
}

document.addEventListener("keydown", (e) => {
	if (e.code == "KeyW") {
		reset_count()
		reset_points()
		context.clearRect(0, 0, width, height)

		drawing_mode == "larva" && (cursor.plot = true)
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
		case "Larva": larva(context, points); break
		case "Pendulums": pendulums(context, points); break
		case "Fins": fins(context, points); break
		case "Orbs": orbs(context, points); break
		case "Circles": circles(context, points); break
		case "Eyes": eyes(context, points); break
		case "Spin": spin(context, points); break
		case "Bounce": bounce(context, points); break
		case "Snake": snake(context, points); break
		case "Squares": squares(context, points); break
		case "Legs": legs(context, points); break
		case "Heart": heart(context); break
		case "Twirls": twirls(context, points); break
		case "Sun": sun(context, points); break
		case "Sphere": sphere(context, points); break
	}
}