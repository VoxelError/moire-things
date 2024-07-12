import { cursor } from "../util/controls"
import { stroke_rect, stroke_square } from "../util/draws"

export default (size, context, points, count) => {
	cursor.held && points.push({
		x: cursor.x,
		y: cursor.y,
		vx: 1,
		vy: 1,
	})

	points.forEach((square) => {
		const side = size.y * 0.1
		const speed = size.y * 0.01

		if (square.x > size.x - side || square.x < 0) { square.vx *= -1 }
		if (square.y > size.y - side || square.y < 0) { square.vy *= -1 }

		square.x += square.vx * speed
		square.y += square.vy * speed

		stroke_rect(context, {
			start: [square.x, square.y],
			dims: [side, side],
			alpha: 0.25
		})

	})
}