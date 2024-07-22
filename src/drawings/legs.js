import { draw_arc, stroke_line } from "../util/draws"
import { abs, cos, cos_wave, degrees, pi, sin, tau } from "../util/math"
import { cursor } from "../util/controls"

export default (context, count, points, size) => {
	cursor.held && points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
	})

	points.forEach((leg) => {
		// const phase = abs(sin(point[2]))
		// const phase = cos(point[2]) * 0.5 + 0.5
		// const phase = cos_wave(point[2], 0.5, 0.5)
		leg.theta += degrees(3)
		const polar = [
			Math.hypot(leg.x - cursor.x, leg.y - cursor.y),
			Math.atan2(leg.y - cursor.y, leg.x - cursor.x)
		]

		// const unit = 50 + phase * 10
		const unit = 100
		const phase = (unit + count) % unit
		const max = polar[0]

		// for (let i = unit; i <= max; i += unit) {
		for (let i = phase; i <= max; i += unit) {
			draw_arc(context, {
				center: [
					leg.x - cos(polar[1]) * (max - i),
					leg.y - sin(polar[1]) * (max - i)
				],
				radius: 1,
				fill: { alpha: (1 - i / max) * 0.5 }
			})
		}

		stroke_line(context, {
			start: [leg.x, leg.y],
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