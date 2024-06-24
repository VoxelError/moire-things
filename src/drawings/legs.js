import { draw_arc, stroke_line } from "../lib/draws"
import { abs, cos, cos_wave, degrees, pi, sin } from "../lib/math"
import { cursor } from "../lib/controls"

export default (size, context, points) => {
	points.forEach((point) => {
		const [x, y, theta] = point
		// const phase = abs(sin(point[2]))
		// const phase = cos(point[2]) * 0.5 + 0.5
		const phase = cos_wave(point[2], 0.5, 0.5)
		point[2] += degrees(3)
		const polar = [
			Math.hypot(x - cursor.x, y - cursor.y),
			Math.atan2(y - cursor.y, x - cursor.x)
		]

		const unit = 50 + phase * 10
		const max = polar[0]

		// for (let i = unit; i <= max; i += unit) {
		// 	draw_arc(context, {
		// 		center: [
		// 			x - cos(polar[1]) * i,
		// 			y - sin(polar[1]) * i
		// 		],
		// 		radius: 1,
		// 		fill: {}
		// 	})
		// }

		// stroke_line(context, {
		// 	start: [x, y],
		// 	end: [
		// 		cursor.x,
		// 		cursor.y
		// 	],
		// 	dash: [5, 5]
		// })

		stroke_line(context, {
			start: [x, y],
			end: [
				x - cos(theta) * cos_wave(point[2], 10, 30),
				y - sin(theta) * cos_wave(point[2], 10, 30),
			],
			alpha: 0.5
		})

		draw_arc(context, {
			center: [
				// x - cos(theta) * 25,
				// y - sin(theta) * 25,
				x,
				y,
			],
			radius: cos_wave(point[2], 10, 10, undefined, pi),
			stroke: {
				alpha: 0.5
			}
		})
	})
}