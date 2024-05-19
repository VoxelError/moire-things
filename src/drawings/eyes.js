import { stroke_arc } from "../lib/draws"
import { abs, cos, degrees, sin } from "../lib/math"
import { cursor } from "../lib/controls"

export default (context, points) => {
	if (points.length > 25) points.length = 25
	points.forEach((point) => {
		const [x, y] = point
		const phase = abs(sin((point[2])))
		point[2] += degrees(3)
		const polar = [Math.hypot(x - cursor.x, y - cursor.y), Math.atan2(y - cursor.y, x - cursor.x)]

		const unit = polar[0] / 50
		const max = polar[0]
		const radius = 100

		for (let i = max; i > 0; i -= unit) {
			const ratio = i / max

			stroke_arc(context, {
				center: [
					x - cos(polar[1]) * (max > radius ? (1 - ratio) * radius : max - i),
					y - sin(polar[1]) * (max > radius ? (1 - ratio) * radius : max - i)
				],
				radius: radius * ratio + phase * 2,
				alpha: 1 - ratio

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