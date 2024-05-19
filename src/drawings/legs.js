import { fill_arc } from "../lib/draws"
import { abs, cos, degrees, sin } from "../lib/math"
import { cursor } from "../lib/controls"

export default (context, points) => {
	points.forEach((point) => {
		const [x, y] = point
		const phase = abs(sin((point[2])))
		point[2] += degrees(3)
		const polar = [Math.hypot(x - cursor.x, y - cursor.y), Math.atan2(y - cursor.y, x - cursor.x)]

		const unit = 25
		const max = polar[0]

		for (let i = unit; i <= max; i += unit) {
			fill_arc(context, {
				center: [
					x - cos(polar[1]) * (polar[0] * i / max),
					y - sin(polar[1]) * (polar[0] * i / max)
				],
				radius: 1 - phase * 0.75,
				// alpha: 1 - phase,

			})
		}

		// stroke_arc(context, {
		// 	center: [
		// 		x - cos(point[3]) * 75,
		// 		y - sin(point[3]) * 75
		// 	],
		// 	radius: 25 - (phase * 5),
		// 	// alpha: 1 - phase,

		// })
	})
}