import { draw_arc, stroke_line } from "../util/draws"
import { abs, cos, cos_wave, degrees, pi, sin, tau } from "../util/math"
import { cursor } from "../util/controls"

export default (size, context, points, count) => {
	points.forEach((point) => {
		const [x, y, theta] = point
		// const phase = abs(sin(point[2]))
		// const phase = cos(point[2]) * 0.5 + 0.5
		// const phase = cos_wave(point[2], 0.5, 0.5)
		point[2] += degrees(3)
		const polar = [
			Math.hypot(x - cursor.x, y - cursor.y),
			Math.atan2(y - cursor.y, x - cursor.x)
		]

		// const unit = 50 + phase * 10
		const unit = 100
		const phase = (unit + count) % unit
		const max = polar[0]

		// for (let i = unit; i <= max; i += unit) {
		for (let i = phase; i <= max; i += unit) {
			draw_arc(context, {
				center: [
					x - cos(polar[1]) * (max - i),
					y - sin(polar[1]) * (max - i)
				],
				radius: 1,
				fill: { alpha: (1 - i / max) * 0.5 }
			})
		}

		stroke_line(context, {
			start: [x, y],
			end: [
				cursor.x,
				cursor.y
			],
			alpha: 0.1,
			dash: []
		})

		// draw_arc(context, {
		// 	center: [
		// 		// x - cos(theta) * 25,
		// 		// y - sin(theta) * 25,
		// 		x,
		// 		y,
		// 	],
		// 	radius: 10,
		// 	stroke: { alpha: 0.35 }
		// })
	})
}