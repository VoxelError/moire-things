import { cursor } from "../util/controls"
import { draw_arc } from "../util/draws"
import { abs, sign } from "../util/math"

export default (size, context, points, count) => {
	cursor.held && points.push({
		x: cursor.x - size.x / 2,
		y: cursor.y - size.y / 2,
		vx: 5,
		vy: 5,
		r: 15,
	})

	context.translate(size.x / 2, size.y / 2)

	points.forEach((bounce) => {
		if (abs(bounce.x) >= size.x / 2 - bounce.r) {
			bounce.x = (size.x / 2 - bounce.r) * sign(bounce.x)
			bounce.vx *= -1
		}

		if (abs(bounce.y) >= size.y / 2 - bounce.r) {
			bounce.y = (size.y / 2 - bounce.r) * sign(bounce.y)
			bounce.vy *= -1
		}

		bounce.x += bounce.vx
		bounce.y += bounce.vy

		draw_arc(context, {
			center: [
				bounce.x,
				bounce.y,
			],
			radius: bounce.r,
			stroke: {
				alpha: 0.25,
				style: `hsl(${bounce.y * 180 / size.y}, 100%, 50%)`
			},
		})
	})
}