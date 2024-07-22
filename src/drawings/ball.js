import { cursor } from "../util/controls"
import { draw_arc } from "../util/draws"
import { abs, cos, rng, sign, sin, tau } from "../util/math"

const new_ball = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	radius: 7,
	gravity: 0.98,
	damping: 0.9,
	traction: 0.8,
	frozen: true,
}

const pin = {
	x: 0,
	y: 0,
}

const max = 250

let counter = 0
const settings = { screen_wrap: false }

export default (context, count, points, size, gui) => {
	if (counter < 1) {
		gui.add(settings, "screen_wrap")
		counter++
	}

	cursor.left_click = () => {
		for (let i = 0; i < max; i++) {
			const theta = i * tau / max

			points[i] = {
				...new_ball,
				x: (cursor.x - size.x / 2) + cos(theta) * 2.5,
				y: (cursor.y - size.y / 2) + sin(theta) * 2.5,
				damping: 0.8 + rng(0.1)
			}
		}
	}
	cursor.left_up = () => {
		for (let i = 0; i < max; i++) {
			const ball = points[i]

			ball.vx = cursor.x - size.x / 2 - ball.x
			ball.vy = cursor.y - size.y / 2 - ball.y
			ball.frozen = false
		}
	}

	cursor.right_click = () => {
		pin.x = cursor.x
		pin.y = cursor.y
	}
	cursor.right_up = () => {
		for (let i = 0; i < max; i++) {
			const ball = points[i]

			ball.vx = cursor.x - pin.x
			ball.vy = cursor.y - pin.y
		}
	}

	context.translate(size.x / 2, size.y / 2)

	points.forEach((ball, index) => {
		if (!ball.frozen) {
			if (abs(ball.x) > size.x / 2 - ball.radius) {
				if (settings.screen_wrap) {
					ball.x = (size.x / 2 - ball.radius) * -sign(ball.x)
				} else {
					ball.vx *= -ball.damping
					ball.x = (size.x / 2 - ball.radius) * sign(ball.x)
				}
			}

			if (abs(ball.y) > size.y / 2 - ball.radius) {
				ball.vy *= -ball.damping
				ball.y = (size.y / 2 - ball.radius) * sign(ball.y)

				if (sign(ball.y) == 1) ball.vx *= ball.traction
			}

			ball.vy += ball.gravity

			// ball.vx *= ball.traction
			// ball.vy *= ball.traction

			ball.x += ball.vx
			ball.y += ball.vy
		}

		draw_arc(context, {
			center: [ball.x, ball.y],
			radius: ball.radius,
			fill: {
				alpha: 0.25,
				style: `hsl(${index * 360 / points.length}, 100%, 50%)`,
			}
		})

		// context.beginPath()
		// context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false)
		// context.globalAlpha = 0.25
		// context.fillStyle = 'white'
		// context.fill()
	})
}