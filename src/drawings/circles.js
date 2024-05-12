import { stroke_arc } from "../draw_tools.js"
import { sin, abs, degrees } from "../math.js"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

const reset_count = () => localStorage.setItem("count", JSON.stringify(0))
const points = JSON.parse(localStorage.getItem("points")) ?? []
const add_point = (x, y, theta = 0, length = 150) => points.push([x, y, theta, length])

const cursor = {
	x: width - 50,
	y: 50,
	r: 0,
	held: false,
}

document.addEventListener("mousedown", (e) => e.button == 0 && (cursor.held = true))
document.addEventListener("mouseup", (e) => cursor.held = false)
document.addEventListener("mousemove", (e) => {
	cursor.x = e.pageX
	cursor.y = e.pageY
})
document.addEventListener("keydown", (e) => {
	if (e.code != "Backquote") return
	reset_count()
	points.length = 0
})

const draw_circles = () => {
	points.forEach((point) => {
		const [x, y] = point
		const phase = abs(sin((point[2])))
		point[2] += degrees(3)

		stroke_arc(context, {
			center: [x, y],
			radius: phase * height * 0.1,
			alpha: phase * 0.5,

		})
	})
}

export default () => {
	localStorage.setItem("points", JSON.stringify(points))
	cursor.held && add_point(cursor.x, cursor.y)

	context.clearRect(0, 0, width, height)
	draw_circles()
}