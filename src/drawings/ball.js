import { draw_arc } from "../util/draws"
import { abs, cos, rng, sign, sin, tau } from "../util/math"

const ball_array = []

const new_ball = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	radius: 10,
	gravity: 0.98,
	damping: 0.9,
	traction: 0.8,
	frozen: true,
}

const pin = {
	x: 0,
	y: 0,
}

document.addEventListener('mousedown', (event) => {
	if (event.button == 0) {
		for (let i = 0; i < 100; i++) {
			const theta = i * tau / 100

			ball_array[i] = {
				...new_ball,
				x: (event.offsetX - event.target.clientWidth / 2) + cos(theta) * 10,
				y: (event.offsetY - event.target.clientHeight / 2) + sin(theta) * 10,
				damping: 0.8 + rng(0.1)
			}
		}
	}

	if (event.button == 2) {
		pin.x = event.offsetX
		pin.y = event.offsetY
	}
})

document.addEventListener('mouseup', (event) => {
	ball_array.forEach((ball) => {
		if (event.button == 0) {
			ball.vx = event.offsetX - event.target.clientWidth / 2 - ball.x
			ball.vy = event.offsetY - event.target.clientHeight / 2 - ball.y
			ball.frozen = false
		}

		if (event.button == 2) {
			ball.vx = event.offsetX - pin.x
			ball.vy = event.offsetY - pin.y
		}
	})
})

export default (context, count, points, size) => {
	context.translate(size.x / 2, size.y / 2)

	ball_array.forEach((ball, index) => {
		if (!ball.frozen) {
			if (Math.hypot(ball.x, ball.y)) {

			}

			if (abs(ball.x) > size.x / 2 - ball.radius) {
				ball.vx *= -ball.damping
				ball.x = (size.x / 2 - ball.radius) * sign(ball.x)
			}

			if (abs(ball.y) > size.y / 2 - ball.radius) {
				ball.vy *= -ball.damping
				ball.y = (size.y / 2 - ball.radius) * sign(ball.y)

				if (sign(ball.y) == 1) ball.vx *= ball.traction
			}

			// ball.vy += ball.gravity

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
				style: `hsl(${index * 360 / ball_array.length}, 100%, 50%)`,
			}
		})

		// context.beginPath()
		// context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false)
		// context.globalAlpha = 0.25
		// context.fillStyle = 'white'
		// context.fill()
	})
}