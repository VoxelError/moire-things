import { abs, sign } from "../util/math"

const ball_array = []

const ball_init = {
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
		ball_array.length = 0
		for (let i = 0; i < 100; i++) {
			ball_array.push({
				...ball_init,
				x: event.offsetX - event.target.clientWidth / 2,
				y: event.offsetY - event.target.clientHeight / 2,
				damping: 0.7 + (i * 0.002),
			})
		}
	}

	if (event.button == 2) {
		pin.x = event.offsetX
		pin.y = event.offsetY
	}
})

document.addEventListener('mouseup', (event) => {
	ball_array.forEach((ball, i) => {
		switch (event.button) {
			case 0: {
				ball.vx = event.offsetX - event.target.clientWidth / 2 - ball.x
				ball.vy = event.offsetY - event.target.clientHeight / 2 - ball.y
				ball.frozen = false
				break
			}
			case 2: {
				ball.vx = event.offsetX - pin.x
				ball.vy = event.offsetY - pin.y
				break
			}
		}
	})
})

export default (size, context, points, count) => {
	context.translate(size.x / 2, size.y / 2)

	ball_array.forEach((ball) => {
		if (!ball.frozen) {
			if (abs(ball.x) > size.x / 2 - ball.radius) {
				ball.vx *= -ball.damping
				ball.x = (size.x / 2 - ball.radius) * sign(ball.x)
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

		context.beginPath()
		context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false)
		context.globalAlpha = 0.25
		context.fillStyle = 'white'
		context.fill()
	})
}