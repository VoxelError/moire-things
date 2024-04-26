import { fill_arc, stroke_arc, stroke_line } from "./draw"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

const pi = Math.PI
const { sin, cos, abs, random, sqrt } = Math
const to_radians = (num) => (num * Math.PI) / 180

const center = {
	x: width / 2,
	y: height / 2
}

let count = 0
const skip = (frames) => !(count % frames)

const points = []
const add_point = (x, y, theta = 0, length = 150) => points.push([x, y, theta, length])

const draw_points = () => cursor.held && add_point(cursor.x, cursor.y)

const plot_points = () => {
	// count < height / 2 && skip(5) && add_point(width / 2, height * 0.75 - count)
	// count < width / 4 && skip(5) && add_point(width - count * 4, 0)
	// count < 200 && skip(10) && add_point(width / 2, height / 2)
	// count < 100 && skip(10) && add_point(center.x, center.y - count, 0, count + 200)
}

// for (let i = 0; i < 15; i++) { add_point(center.x, center.y - 200, 0, i * 15 + 200) }

const cursor = {
	x: width / 2,
	y: height / 2,
	r: 0,
	delta: 0,
	held: false,
	grabbed: true,
	size: 25
}

const move_cursor = (e) => {
	cursor.x = e.pageX
	cursor.y = e.pageY
}

const add_eye = (e) => {
	add_point(e.pageX, e.pageY)
	// for (let i = 0; i < 10; i++) {
	// 	setTimeout(() => {
	// 		add_point(e.pageX, e.pageY - i * 10)
	// 	}, i * 200);
	// }
}

// document.addEventListener("mousedown", (e) => {
// 	pos.held = true
// 	move_point(e)
// })
// document.addEventListener("mouseup", (e) => { pos.held = false })
// document.addEventListener("mousemove", (e) => { pos.held && move_point(e) })
// document.addEventListener("mousedown", add_eye)
document.addEventListener("mousedown", (e) => { cursor.held = true })
document.addEventListener("mouseup", (e) => { cursor.held = false })
document.addEventListener("mousemove", (e) => { move_cursor(e) })
// document.addEventListener("wheel", (e) => {
// 	e.preventDefault()
// 	cursor.size += e.deltaY * 0.1
// })

const draw_pendulums = () => {
	points.forEach((point) => {
		const length = point[3]
		const gravity = 9.82
		const amplitude = to_radians(45)
		const time = () => point[2] += 0.25
		const theta = amplitude * cos(1 / sqrt(length / gravity) * time())

		// point[2] += to_radians(3)
		// const angle = cos(point[2])
		const [x, y] = point

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * sin(theta)),
				y + (length * cos(theta))
			],
			width: 8,
			stroke: "grey",
			cap: "round",
			alpha: 0.25
			// alpha: abs(sin((point[2] + pi / 2) / 2))
		})

		fill_arc(context, {
			center: [
				x + (length * sin(theta)),
				y + (length * cos(theta))
			],
			radius: 15
		})
	})
}

const draw_circles = () => {
	points.forEach((point) => {
		const [x, y] = point
		const phase = abs(sin((point[2])))
		point[2] += to_radians(3)

		stroke_arc(context, {
			center: [x, y],
			radius: phase * height * 0.1,
			alpha: phase * 0.5,

		})
	})
}

const draw_eyes = () => {
	points.forEach((point) => {
		const [x, y] = point
		const phase = abs(sin((point[2])))
		point[2] += to_radians(3)

		stroke_arc(context, {
			center: [x, y],
			radius: phase * height * 0.1,
			alpha: phase * 0.5,

		})
	})
}

const draw_cursor = () => {
	cursor.delta += to_radians(1)
	stroke_arc(context, { center: [cursor.x, cursor.y], radius: abs(sin(cursor.delta * 2.5) * cursor.size) })
}

const fade = (alpha) => {
	context.save()
	context.globalAlpha = alpha
	context.fillStyle = "black"
	context.fillRect(0, 0, width, height)
	context.restore()
}

// context.globalCompositeOperation = "xor"

const render = () => {
	count++
	draw_points()
	plot_points()
	// context.clearRect(0, 0, width, height)
	fade(0.25)
	// !(count % 50) && fade(0.5)
	// draw_eyes()
	draw_circles()
	draw_cursor()

	requestAnimationFrame(render)
}

render()