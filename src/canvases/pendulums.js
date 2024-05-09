import { get_draw_mode } from "../controls.js"
import { fill_arc, stroke_arc, stroke_line, stroke_square } from "../draw_tools.js"
import { pi, sin, cos, abs, sqrt, random, floor, degrees, to_degrees, sin_wave, cos_wave } from "../math.js"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

let count = 0
const reset_count = () => localStorage.setItem("count", JSON.stringify(0))
const points = JSON.parse(localStorage.getItem("points")) ?? []

const skip = (frames) => !(count % frames)
const add_point = (x, y, theta = 0, length = 150) => points.push([x, y, theta, length])

const draw_points = () => {
	if (!cursor.held) return

	if (get_draw_mode() == 5) {
		add_point(cursor.x, cursor.y)
		cursor.held = false
		return
	}

	if (get_draw_mode() == 7) {
		add_point(cursor.x, cursor.y, 0, 1)
		return
	}

	if (get_draw_mode() == 9) {
		add_point(cursor.x, cursor.y, 1, 1)
		return
	}

	if (get_draw_mode() == 0) return

	add_point(cursor.x, cursor.y)
}

const plot_points = () => {
	const mult = 10
	if (get_draw_mode() == 0) {
		for (let i = 0; i < 6; i++) {
			add_point(width / 2, height / 2, 0, 0)
		}
	}
	cursor.plot = false
	// count < width / mult ? add_point(count * mult, height - (count ** 1.325)) : cursor.plot = false
	// count <= 45 && add_point(sin_wave(degrees(count * 10), width / 4, width / 2, degrees(45)), (count * 10) + 250)
	// count < height / 2 && skip(5) && add_point(width / 2, height * 0.75 - count)
	// count < width / 4 && skip(5) && add_point(width - count * 4, 0)
	// count < 200 && skip(10) && add_point(width / 2, height / 2)
	// count < 100 && skip(10) && add_point(center.x, center.y - count, 0, count + 200)7
	// count < height && skip(10) && add_point(width / 2 + count, count)
}

const cursor = {
	x: width - 50,
	y: 50,
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
document.addEventListener("wheel", (e) => {
	// 	e.preventDefault()
	// 	cursor.size += e.deltaY * 0.1
})
document.addEventListener("keydown", (e) => {
	if (e.code == "Backquote") {
		reset_count()
		points.length = 0
		cursor.plot = true
		// for (let i = 0; i < 66; i++) { add_point(width / 2, height / 2 + i * 5, 0, i * 5 + 150) }
	}
})

const draw_pendulums = () => {
	const gravity = 9.82
	const amplitude = degrees(45)

	points.forEach((point) => {
		const [x, y, theta, length] = point
		const motion = cos(1 / sqrt(length / gravity) * theta) * amplitude

		point[2] += degrees(15)

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * sin(motion)),
				y + (length * cos(motion))
			],
			width: 8,
			stroke: "grey",
			cap: "round",
			// alpha: 0.5 * (sin(1 / sqrt(length / gravity) * theta) + 1),
			alpha: 0.25,
		})

		fill_arc(context, {
			center: [
				x + (length * sin(motion)),
				y + (length * cos(motion))
			],
			radius: 15,
			// alpha: 0.5 * (sin(1 / sqrt(length / gravity) * theta) + 1),
			alpha: 1,
		})
	})
}

const draw_fins = () => {
	points.forEach((point) => {
		const [x, y, theta, length] = point
		const motion = cos(theta / sqrt(length * 0.15))

		point[2] += degrees(15)

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * sin(motion)),
				y + (length * cos(motion))
			],
			width: 8,
			stroke: "grey",
			// alpha: 0.25 * (sin(theta / sqrt(length * 0.15)) + 1),
			alpha: sin_wave(theta / sqrt(length * 0.15), 0.25, 0.35),
			// alpha: 0.25,
		})
	})
}

const draw_orbs = () => {
	const amplitude = degrees(30)

	points.forEach((point) => {
		const [x, y, theta, length] = point
		const motion = cos(theta / sqrt(length * 0.15)) * amplitude

		point[2] += degrees(15)

		fill_arc(context, {
			center: [
				x + (length * sin(motion)),
				y + (length * cos(motion))
			],
			radius: 15,
			alpha: 0.25 * (sin(theta / sqrt(length * 0.15)) + 1.1),
			// alpha: 0.5,
		})
	})
}

const draw_bounce = () => {
	points.forEach((point) => {
		const [x, y, theta] = point

		const gravity = 9.82
		const amplitude = height - y
		const motion = height - abs(cos_wave(theta, amplitude, 0, 1 / sqrt(amplitude / gravity)))
		// const motion = abs(cos(theta / sqrt(length * 0.15)) * y)
		// const motion = height - abs(cos_wave(theta / sqrt(height - y / gravity), height - y))

		point[2] += degrees(15)

		fill_arc(context, {
			center: [
				x,
				motion
			],
			radius: 15,
			alpha: 0.5,
		})
	})
}

const draw_spin = () => {
	const middle = width / 2

	stroke_line(context, {
		start: [middle, 0],
		end: [middle, height],
		stroke: "grey",
		alpha: 0.15 * sin(count * 0.08) + 0.5,
	})

	points.forEach((point) => {
		const [x, y, theta] = point
		const motion = cos_wave(theta, x - middle, middle)
		// const transparency = sin_wave(x < middle ? -theta : theta, 0.5, 0.5)
		const transparency = sin_wave(theta, 0.5, 0.5)

		point[2] += degrees(3)

		fill_arc(context, {
			center: [
				motion,
				y
			],
			radius: 15,
			alpha: transparency,
		})
	})
}

const draw_snake = () => {
	const middle = width / 2

	stroke_line(context, {
		start: [middle, 0],
		end: [middle, height],
		stroke: "grey",
		alpha: 0.15 * sin(count * 0.08) + 0.5,
	})

	points.forEach((point) => {
		const [x, y, theta] = point
		const motion = (x - middle) * cos(theta) + middle
		const alpha = 0.5 * sin(degrees(720) * theta) + 0.5
		point[2] += degrees(3)

		fill_arc(context, {
			center: [
				motion,
				y
			],
			radius: 15 + alpha * 10,
			// alpha: 0.25 * (sin(theta / sqrt(length * 0.15)) + 1.1),
			// alpha: 0.5 * sin(theta) + 0.5,
			// alpha: 0.5 * sin(x < middle ? -theta : theta) + 0.5,
			// alpha: 0.5 * sin(degrees(1) * motion) + 0.5,
			alpha,
		})
	})
}

const draw_circles = () => {
	points.forEach((point) => {
		const [x, y] = point
		const phase = abs(sin((point[2])))
		point[2] += degrees(3)

		stroke_arc(context, {
			center: [x, y],
			radius: phase * height * 0.1,
			// alpha: 1 - phase,
			alpha: phase * 0.5,

		})
	})
}

// add_point(width / 2, height / 2, 50, 50)
// add_point(width / 2, height / 2, -50, 50)
// add_point(width / 2, height / 2, 50, -50)
// add_point(width / 2, height / 2, -50, -50)

const draw_squares = () => {
	const side = width / 10

	points.forEach((point) => {
		if (point[0] > width - side / 2 || point[0] < 0 + side / 2) { point[2] *= -1 }
		if (point[1] > height - side / 2 || point[1] < 0 + side / 2) { point[3] *= -1 }

		point[0] += point[2] * 50
		point[1] += point[3] * 10

		stroke_square(context, {
			center: [point[0], point[1]],
			side,
			alpha: 0.5

		})

	})
}

const draw_eyes = () => {
	points.forEach((point) => {
		const [x, y] = point
		const phase = abs(sin((point[2])))
		point[2] += degrees(3)
		point[3] = Math.atan2(y - cursor.y, x - cursor.x)

		const unit = 10
		const max = 100

		for (let i = unit; i <= max; i += unit) {
			stroke_arc(context, {
				center: [
					x - cos(point[3]) * (max - i),
					y - sin(point[3]) * (max - i)
				],
				radius: i - (phase * unit),
				// alpha: 1 - phase,

			})
		}

		// stroke_arc(context, {
		// 	center: [
		// 		x - cos(point[3]) * 75,
		// 		y - sin(point[3]) * 75
		// 	],
		// 	radius: 25 - (phase * 5),
		// 	// alpha: 1 - phase,

		// })
	})
}

const draw_larva = () => {
	if (points.length > 6) points.length = 6
	points.forEach((point, index) => {
		point[2] = degrees(count / 200) * (index + 1)

		const unit = 5
		const max = 500

		// context.save()
		// if (index == 1) context.scale(1, 0.25)
		// if (index == 1) context.translate(0, height * 1.5)

		for (let i = unit; i <= max; i += unit) {
			stroke_arc(context, {
				center: [
					width / 2 + cos(point[2]) * (max - i),
					height / 2 - sin(point[2]) * (max - i)
					// width / 2,
					// height / 2
				],
				// radius: i - (phase * unit),
				radius: i,
				alpha: 0.25,
				stroke: "red"

			})
		}

		// context.restore()
	})

	context.fillStyle = "white"
	context.font = "30px Arial"
	context.globalAlpha = 0.1
	context.fillText(count, 25, 50)
}

const draw_cursor = () => {
	cursor.delta += degrees(1)
	stroke_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius: abs(sin(cursor.delta * 2.5) * cursor.size / 5)
	})
}

const fade = (alpha) => {
	context.save()
	context.globalAlpha = alpha
	context.fillStyle = "black"
	context.fillRect(0, 0, width, height)
	context.restore()
}

// context.globalCompositeOperation = "xor"

export default () => {
	context.clearRect(0, 0, width, height)
	// fade(0.25)

	count = JSON.parse(localStorage.getItem("count"))
	localStorage.setItem("points", JSON.stringify(points))
	cursor.plot && plot_points()
	draw_points()
	draw_cursor()

	// draw_pendulums()

	switch (get_draw_mode()) {
		case 1: draw_pendulums(); break
		case 2: draw_fins(); break
		case 3: draw_orbs(); break
		case 4: draw_circles(); break
		case 5: draw_eyes(); break
		case 6: draw_spin(); break
		case 7: draw_bounce(); break
		case 8: draw_snake(); break
		case 9: draw_squares(); break
		case 0: draw_larva(); break
	}
}