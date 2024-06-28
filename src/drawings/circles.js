import { draw_arc } from "../util/draws.js"
import { sin, abs, degrees } from "../util/math.js"

export default (size, context, points, count) => {
	points.forEach((point) => {
		const [x, y] = point
		const phase = abs(sin((point[2])))
		point[2] += degrees(3)

		draw_arc(context, {
			center: [x, y],
			radius: phase * size.y * 0.1,
			stroke: {
				// alpha: 1 - phase,
				alpha: phase * 0.25,
			}

		})
	})
}