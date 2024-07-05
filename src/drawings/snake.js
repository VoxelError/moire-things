import { stroke_arc } from "../util/draws"
import { degrees, sin_wave, tau } from "../util/math"
import { cursor } from "../util/controls"

export default (size, context, points, count) => {
	cursor.held && points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
	})

	points.forEach((point) => {
		const phase = sin_wave(2 * tau * point.theta, 0.5, 0.5)
		point.theta += degrees(3)

		stroke_arc(context, {
			center: [point.x, point.y],
			radius: 15 + phase * 10,
			// alpha: 0.5 * sin(theta * 2) + 0.5,
			alpha: phase,
		})
	})
}