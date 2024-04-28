import { fill_arc, stroke_arc, stroke_line, stroke_square } from "./draw_tools"

const canvas = document.getElementById("game_canvas")
const context = canvas.getContext("2d")

const width = canvas.width = window.innerWidth
const height = canvas.height = window.innerHeight

const pi = Math.PI
const { sin, cos, abs, random, sqrt } = Math
const to_radians = (num) => (num * Math.PI) / 180
const sin_wave = (theta, amplitude = 1, v_shift = 0, frequency = 1, phase = 0) => amplitude * sin(frequency * (theta - phase)) + v_shift
const cos_wave = (theta, amplitude = 1, v_shift = 0, frequency = 1, phase = 0) => amplitude * cos(frequency * (theta - phase)) + v_shift

let count = 0
const skip = (frames) => !(count % frames)

let draw_mode = JSON.parse(localStorage.getItem("draw_mode")) ?? 1
const points = JSON.parse(localStorage.getItem("points")) ?? []
const add_point = (x, y, theta = 0, length = 150) => points.push([x, y, theta, length])

const draw_points = () => {
	if (!cursor.held) return

	if (draw_mode == 1 && !skip(5)) return
	if (draw_mode == 2 && !skip(5)) return
	if (draw_mode == 3 && !skip(5)) return

	add_point(cursor.x, cursor.y)
}

const plot_points = () => {
	// const count_x = (multiplier) => (count - 1) * multiplier
	// count < height / 2 && skip(5) && add_point(width / 2, height * 0.75 - count)
	// count < width / 4 && skip(5) && add_point(width - count * 4, 0)
	// count < 200 && skip(10) && add_point(width / 2, height / 2)
	// count < 100 && skip(10) && add_point(center.x, center.y - count, 0, count + 200)
	// count < height && skip(10) && add_point(width / 2 + count, count)
	// count <= 45 && add_point(sin_wave(to_radians(count_x(10)), width / 4, width / 2, to_radians(45)), count_x(10) + 250)
}

const cursor = {
	x: width / 2,
	y: height / 2,
	r: 0,
	delta: 0,
	held: false,
	grabbed: true,
	size: 66
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

document.addEventListener("mousedown", (e) => {
	e.button == 0 && (cursor.held = true)
})
document.addEventListener("mouseup", (e) => {
	cursor.held = false
})
document.addEventListener("mousemove", (e) => {
	move_cursor(e)
})
document.addEventListener("wheel", (e) => {
	// 	e.preventDefault()
	// 	cursor.size += e.deltaY * 0.1
})
document.addEventListener("keydown", (e) => {
	if (e.code == "Backquote") {
		count = 0
		points.length = 0
		// for (let i = 0; i < 66; i++) { add_point(width / 2, height / 2 + i * 5, 0, i * 5 + 150) }
	}
	for (let i = 1; i < 10; i++) {
		e.code == `Digit${i}` && (draw_mode = i)
	}
})

const draw_pendulums = () => {
	const gravity = 9.82
	const amplitude = to_radians(45)

	points.forEach((point) => {
		const [x, y, theta, length] = point
		const motion = cos(1 / sqrt(length / gravity) * theta) * amplitude

		point[2] += to_radians(15)

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

		point[2] += to_radians(15)

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
	const amplitude = to_radians(30)

	points.forEach((point) => {
		const [x, y, theta, length] = point
		const motion = cos(theta / sqrt(length * 0.15)) * amplitude

		point[2] += to_radians(15)

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
	const gravity = 9.82

	points.forEach((point) => {
		const [x, y, theta, length] = point
		// const motion = abs(cos(theta / sqrt(length * 0.15)) * y)
		const motion = height - abs(cos_wave(theta / sqrt(height - y / gravity), height - y))

		point[2] += to_radians(60)

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

		point[2] += to_radians(3)

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
		const alpha = 0.5 * sin(to_radians(720) * theta) + 0.5
		point[2] += to_radians(3)

		fill_arc(context, {
			center: [
				motion,
				y
			],
			radius: 15 + alpha * 10,
			// alpha: 0.25 * (sin(theta / sqrt(length * 0.15)) + 1.1),
			// alpha: 0.5 * sin(theta) + 0.5,
			// alpha: 0.5 * sin(x < middle ? -theta : theta) + 0.5,
			// alpha: 0.5 * sin(to_radians(1) * motion) + 0.5,
			alpha,
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
			alpha: 1 - phase,
			// alpha: phase * 0.4,

		})
	})
}

// add_point(width / 2, height / 2, 50, 50)
// add_point(width / 2, height / 2, -50, 50)
// add_point(width / 2, height / 2, 50, -50)
// add_point(width / 2, height / 2, -50, -50)

const draw_squares = () => {
	const side = 250

	points.forEach((point) => {
		if (point[0] > width - side / 2 || point[0] < 0 + side / 2) { point[2] *= -1 }
		if (point[1] > height - side / 2 || point[1] < 0 + side / 2) { point[3] *= -1 }

		point[0] += point[2]
		point[1] += point[3]

		stroke_square(context, {
			center: [point[0], point[1]],
			side,
			alpha: 0.1

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
	stroke_arc(context, { center: [cursor.x, cursor.y], radius: abs(sin(cursor.delta * 2.5) * cursor.size / 2) })
}

const fade = (alpha) => {
	context.save()
	context.globalAlpha = alpha
	context.fillStyle = "black"
	context.fillRect(0, 0, width, height)
	context.restore()
}

// context.globalCompositeOperation = "xor"

export const render = () => {
	count++

	context.clearRect(0, 0, width, height)
	// fade(0.25)

	localStorage.setItem("points", JSON.stringify(points))
	localStorage.setItem("draw_mode", JSON.stringify(draw_mode))
	draw_points()
	plot_points()

	draw_mode == 1 && draw_pendulums()
	draw_mode == 2 && draw_fins()
	draw_mode == 3 && draw_orbs()

	draw_mode == 4 && draw_eyes()
	draw_mode == 5 && draw_circles()

	draw_mode == 6 && draw_spin()
	draw_mode == 7 && draw_bounce()
	draw_mode == 8 && draw_snake()

	draw_mode == 9 && draw_squares()

	draw_cursor()

	requestAnimationFrame(render)
}