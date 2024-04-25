import { fill_arc, stroke_arc, stroke_line } from "./draw"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

const pi = Math.PI
const { sin, cos, abs, random } = Math
const to_radians = (num) => (num * Math.PI) / 180

const pendulum = {
	x: width / 2,
	y: height / 2,
	length: 150,
	angle: 0
}

const points = []
const add_point = (x, y, a = 0) => points.push([x, y, a])

const draw_pendulums = () => {
	const { length } = pendulum
	points.forEach((point) => {
		point[2] += to_radians(3)
		const angle = cos(point[2]) - (pi / 2)
		const [x, y] = point

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * cos(angle)),
				y - (length * sin(angle))
			],
			width: 8,
			stroke: "grey",
			alpha: 0.5
		})

		fill_arc(context, {
			center: [
				x + (length * cos(angle)),
				y - (length * sin(angle))
			],
			radius: 15
		})
	})
}

const pos = {
	x: width / 2,
	y: height / 2,
	r: 0,
	held: false,
	grabbed: true
}

const move_cursor = (e) => {
	pos.x = e.pageX
	pos.y = e.pageY
}

// document.addEventListener("mousedown", (e) => {
// 	pos.held = true
// 	move_point(e)
// })
// document.addEventListener("mouseup", (e) => { pos.held = false })
// document.addEventListener("mousemove", (e) => { pos.held && move_point(e) })
document.addEventListener("mousedown", (e) => { pos.held = true })
document.addEventListener("mouseup", (e) => { pos.held = false })
document.addEventListener("mousemove", (e) => { move_cursor(e) })

const circles = () => {
	// context.globalAlpha = random() / 4
	pos.r += to_radians(1)

	// pos.x += (random() * 40) - 20
	// pos.y += (random() * 40) - 20

	// stroke_arc(context, { center: [pos.x, pos.y], radius: random() * 50 })
	/* pos.held &&  */stroke_arc(context, { center: [pos.x, pos.y], radius: abs(sin(pos.r * 2.5) * 25) + 10 })
}

const fade = (alpha) => {
	context.save()
	context.globalAlpha = alpha
	context.fillStyle = "black"
	context.fillRect(0, 0, width, height)
	context.restore()
}

let count = 0
const draw = () => {
	count++
	// context.clearRect(0, 0, width, height)
	if (pos.held && !(count % 5)) { add_point(pos.x, pos.y) }
	if (count < 150 && !(count % 5)) { add_point(width / 2, height / 2 - count) }
	draw_pendulums()
	circles()

	fade(0.25)
	// !(count % 50) && fade(0.5)
}

const render = () => {
	draw()
	requestAnimationFrame(render)
}

render()