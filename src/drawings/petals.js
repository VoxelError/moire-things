import { stroke_arc } from "../util/draws"
import { abs, cos, degrees, sin } from "../util/math"
import { cursor } from "../util/controls"

export default (context, count, points, size) => {
	cursor.held_left && points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
	})

	points.forEach((point) => {
		const phase = abs(sin(point.theta))
		point.theta += degrees(3)
		const polar = [
			Math.hypot(point.x - cursor.x, point.y - cursor.y),
			Math.atan2(point.y - cursor.y, point.x - cursor.x),
		]

		const unit = polar[0] / 20
		const max = polar[0]
		const radius = 100

		for (let i = max; i > 0; i -= unit) {
			const ratio = i / max
			const facing = -1

			stroke_arc(context, {
				center: [
					point.x - cos(polar[1]) * (max > radius ? (1 - ratio) * radius : max - i) * facing,
					point.y - sin(polar[1]) * (max > radius ? (1 - ratio) * radius : max - i) * facing
				],
				radius: radius * ratio / 2 + phase * 2,
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