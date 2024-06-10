import { drawing_mode } from "../lib/controls"
import { abs, sign } from "../lib/math"

const ball_set = []
const add_ball = (
	x = 0,
	y = 0,
	vx = 0,
	vy = 0,
	radius = 10,
	gravity = 0.98,
	damping = 0.9,
	traction = 0.8,
	frozen = true,
) => ball_set.push({ x, y, vx, vy, radius, gravity, damping, traction, frozen })

const pin = {
	x: 0,
	y: 0,
}

document.addEventListener('mousedown', (event) => {
	if (drawing_mode !== "ball") return

	if (event.button == 0) {
		ball_set.length = 0
		for (let i = 0; i < 100; i++) {
			add_ball(
				event.pageX - window.innerWidth / 2,
				event.pageY - window.innerHeight / 2,
				undefined,
				undefined,
				undefined,
				undefined,
				0.9 - (i * 0.001),
			)
		}
	}

	if (event.button == 2) {
		pin.x = event.pageX
		pin.y = event.pageY
	}
})

document.addEventListener('mouseup', (event) => {
	if (drawing_mode !== "ball") return

	ball_set.forEach((ball) => {
		switch (event.button) {
			case 0: {
				ball.vx = event.pageX - window.innerWidth / 2 - ball.x
				ball.vy = event.pageY - window.innerHeight / 2 - ball.y
				ball.frozen = false
				break
			}
			case 2: {
				ball.vx = event.pageX - pin.x
				ball.vy = event.pageY - pin.y
				break
			}
		}
	})
})

export default (context) => {
	context.translate(window.innerWidth / 2, window.innerHeight / 2)

	ball_set.forEach((ball) => {
		if (!ball.frozen) {
			if (abs(ball.x) > window.innerWidth / 2 - ball.radius) {
				ball.vx *= -ball.damping
				ball.x = (window.innerWidth / 2 - ball.radius) * sign(ball.x)
			}

			if (abs(ball.y) > window.innerHeight / 2 - ball.radius) {
				ball.vy *= -ball.damping
				ball.y = (window.innerHeight / 2 - ball.radius) * sign(ball.y)
				if (sign(ball.y) == 1) ball.vx *= ball.traction
			}

			ball.vy += ball.gravity

			// ball.vx *= ball.traction
			// ball.vy *= ball.traction

			ball.x += ball.vx
			ball.y += ball.vy
		}

		context.beginPath()
		context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false)
		context.globalAlpha = 0.25
		context.fillStyle = 'white'
		context.fill()
	})

}