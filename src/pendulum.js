import { fill_arc, stroke_arc, stroke_line } from "./draw"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

const pi = Math.PI
const { sin, cos, random } = Math
const to_radians = (num) => (num * Math.PI) / 180

const pendulum = {
	x: width / 2,
	y: height / 2,
	length: 150,
	angle: 0
}

const draw_pendulum = () => {
	const { x, y, length } = pendulum
	const angle = cos(pendulum.angle) - (pi / 2)

	pendulum.angle += to_radians(3)

	stroke_line(context, {
		start: [x, y],
		end: [
			x + (length * cos(angle)),
			y - (length * sin(angle))
		],
		width: 8,
		stroke: "grey"
	})

	fill_arc(context, {
		center: [
			x + (length * cos(angle)),
			y - (length * sin(angle))
		],
		radius: 15
	})
}

const pos = { x: 0, y: 0 }

// document.addEventListener("mousemove", (e) => {
// 	pos.x = e.pageX
// 	pos.y = e.pageY
// })

const draw = () => {
	context.globalAlpha = random() / 2
	// context.clearRect(0, 0, width, height)

	pos.x = random() * width
	pos.y = random() * height

	stroke_arc(context, { center: [pos.x, pos.y], radius: random() * 50 })

	// draw_pendulum()
}

let count = 0

const render = () => {
	count++
	if (count > 1) {
		count = 0
		draw()
	}
	requestAnimationFrame(render)
}

render()