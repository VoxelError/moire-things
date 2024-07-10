import { draw_arc, stroke_line } from "../util/draws"
import { cos, cos_wave, degrees, pi, sin, sin_wave, tau } from "../util/math"
import { cursor } from "../util/controls"

export default (size, context, points, count) => {
	cursor.held && points.push({
		x: cursor.x - size.x / 2,
		y: cursor.y,
		delta: count,
		theta: cos(tau * size.x / 2)
	})

	const mid = size.x / 2

	// implement z-axis

	context.translate(size.x / 2, 0)

	stroke_line(context, {
		start: [0, 0],
		end: [0, size.y],
		style: "gray",
		alpha: 0.15 * sin(count * 0.08) + 0.5,
	})

	points.forEach((point) => {
		const theta = degrees((count - point.delta) * 3)
		const motion = cos_wave(theta, point.x, 0)
		const rotation = () => {
			if (point.x < mid) return -theta
			if (point.x > mid) return theta
			if (point.x == mid) return 1
		}
		// const transparency = sin_wave(theta, 0.5, 0.5)
		const transparency = cos_wave(theta, 0.5, 0.5, 1, pi / 2)

		draw_arc(context, {
			center: [motion, point.y],
			radius: 15,
			fill: { alpha: transparency }
		})
	})
}