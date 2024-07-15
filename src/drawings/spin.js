import { draw_arc, stroke_line } from "../util/draws"
import { cos, cos_wave, degrees, pi, sign, sin, sin_wave, tau } from "../util/math"
import { cursor } from "../util/controls"

export default (context, count, points, size) => {
	cursor.held && points.push({
		x: cursor.x - size.x / 2,
		y: cursor.y,
		delta: count,
	})

	context.translate(size.x / 2, 0)

	stroke_line(context, {
		start: [0, 0],
		end: [0, size.y],
		style: "gray",
		alpha: sin_wave(count, 0.15, 0.5, 0.04),
	})

	points.forEach((point) => {
		const theta = degrees((count - point.delta) * 3) * sign(point.x)
		const transparency = sin_wave(theta, 0.25, 0.25)

		draw_arc(context, {
			center: [
				cos_wave(theta, point.x, 0),
				point.y
			],
			radius: 15,
			fill: { alpha: transparency }
		})
	})
}