import { stroke_arc } from "../draw_tools"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

const { PI: pi, sin, abs } = Math

const to_radians = (num) => (num * pi) / 180

let count = 0
const points = JSON.parse(localStorage.getItem("points")) ?? []

const add_point = (x, y, theta = 0, length = 150) => points.push([x, y, theta, length])
const draw_points = () => cursor.held && add_point(cursor.x, cursor.y)

const cursor = {
	x: width / 2,
	y: height / 2,
	r: 0,
	delta: 0,
	held: false,
	grabbed: true,
	size: 66,
	plot: false
}

document.addEventListener("mousedown", (e) => {
	e.button == 0 && (cursor.held = true)
})
document.addEventListener("mouseup", (e) => {
	cursor.held = false
})
document.addEventListener("mousemove", (e) => {
	cursor.x = e.pageX
	cursor.y = e.pageY
})
document.addEventListener("keydown", (e) => {
	if (e.code == "Backquote") {
		count = 0
		points.length = 0
		cursor.plot = true
	}
})

const draw_circles = () => {
	points.forEach((point) => {
		const [x, y] = point
		const phase = abs(sin((point[2])))
		point[2] += to_radians(3)

		stroke_arc(context, {
			center: [x, y],
			radius: phase * height * 0.1,
			// alpha: 1 - phase,
			alpha: phase * 0.5,

		})
	})
}

const draw_cursor = () => {
	cursor.delta += to_radians(1)
	stroke_arc(context, { center: [cursor.x, cursor.y], radius: abs(sin(cursor.delta * 2.5) * cursor.size / 2) })
}

export default () => {
	count++

	context.clearRect(0, 0, width, height)

	localStorage.setItem("count", JSON.stringify(count))
	localStorage.setItem("points", JSON.stringify(points))
	draw_points()
	draw_cursor()

	draw_circles()
}