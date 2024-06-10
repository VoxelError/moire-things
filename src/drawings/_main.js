import { cursor, draw_points, drawing_mode } from "../lib/controls.js"
import ball from "./ball.js"

import bounce from "./bounce.js"
import circles from "./circles.js"
import fins from "./fins.js"
import heart from "./heart.js"
import larva from "./larva.js"
import legs from "./legs.js"
import orbs from "./orbs.js"
import pendulums from "./pendulums.js"
import petals from "./petals.js"
import pillar from "./pillar.js"
import pointer from "./pointer.js"
import snake from "./snake.js"
import sphere from "./sphere.js"
import spin from "./spin.js"
import squares from "./squares.js"
import stalks from "./stalks.js"
import stare from "./stare.js"
import sun from "./sun.js"
import trails from "./trails.js"
import tree from "./tree.js"
import twirls from "./twirls.js"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

const resize_canvas = () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}
window.addEventListener('resize', resize_canvas())
canvas.addEventListener("contextmenu", (event) => event.preventDefault())

let count = JSON.parse(localStorage.getItem("count")) ?? 0
const points = JSON.parse(localStorage.getItem("points")) ?? []

export const add_count = (value = 1) => count += value
export const add_point = (x, y, theta = 0, length = 0) => points.push([x, y, theta, length])

export const reset_count = () => count = 0
export const reset_points = () => points.length = 0
export const reset_canvas = () => context.reset()

const fade = () => {
	const image_data = context.getImageData(0, 0, window.innerWidth, window.innerHeight);
	const rgba_array = image_data.data;
	for (let i = 0; i < rgba_array.length; i += 4) {
		const unit = 16
		rgba_array[i] -= unit
		rgba_array[i + 3] -= unit
	}
	context.putImageData(image_data, 0, 0);
}

const plot = () => {
	const skip = (frames) => !(count % frames)

	// count < window.innerWidth / 10 && add_point(count * 10, window.innerHeight - (count ** 1.325))
	count < window.innerHeight / 2 && skip(5) && add_point(window.innerWidth / 2, window.innerHeight * 0.75 - count)
	// count < width / 4 && skip(5) && add_point(width - count * 4, 0)
	// count < 200 && skip(10) && add_point(width / 2, height / 2)
	// count < 100 && skip(10) && add_point(center.x, center.y - count, 0, count + 200)7
	// count < height && skip(10) && add_point(width / 2 + count, count)

	// for (let i = 0; i < 66; i++) { add_point(width / 2, height / 2 + i * 5, 0, i * 5 + 150) }
}

window.pause = false

export default () => {
	!window.pause && add_count()
	localStorage.setItem("count", JSON.stringify(count))
	localStorage.setItem("points", JSON.stringify(points))
	localStorage.setItem("drawing_mode", JSON.stringify(drawing_mode))
	draw_points()

	switch (drawing_mode) {
		case "pillar": break
		case "stalks": break
		default: context.reset()
	}

	switch (drawing_mode) {
		case "ball": ball(context); break
		case "bounce": bounce(context, points); break
		case "circles": circles(context, points); break
		case "fins": fins(context, points, count); break
		case "heart": heart(context, count); break
		case "larva": larva(context, count); break
		case "legs": legs(context, points); break
		case "orbs": orbs(context, points); break
		case "pendulums": pendulums(context, points); break
		case "petals": petals(context, points); break
		case "pillar": pillar(context, points, count); break
		case "snake": snake(context, points); break
		case "sphere": sphere(context, count); break
		case "spin": spin(context, points, count); break
		case "stalks": stalks(context, points, count); break
		case "squares": squares(context, points); break
		case "stare": stare(context, count); break
		case "sun": sun(context, points, count); break
		case "trails": trails(context, points, count); break
		case "tree": tree(context, count); break
		case "twirls": twirls(context, points); break
	}
}