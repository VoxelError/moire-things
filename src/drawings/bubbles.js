import { cursor } from "../util/controls.js"
import { draw_arc } from "../util/draws.js"
import { sin, abs, degrees } from "../util/math.js"

export default (context, count, points, size) => {
	cursor.held_left && points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
	})

	points.forEach((circle) => {
		const phase = abs(sin((circle.theta)))
		circle.theta += degrees(3)

		draw_arc(context, {
			center: [circle.x, circle.y],
			radius: phase * size.y * 0.1,
			stroke: {
				// alpha: 1 - phase,
				alpha: phase * 0.25,
			}

		})
	})
}