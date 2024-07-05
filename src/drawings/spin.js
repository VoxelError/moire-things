import { draw_arc, stroke_line } from "../util/draws"
import { cos_wave, degrees, sin, sin_wave } from "../util/math"
import { cursor } from "../util/controls"

export default (size, context, points, count) => {
	cursor.held && points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
	})

	const mid = size.x / 2

	// implement z-axis

	stroke_line(context, {
		start: [mid, 0],
		end: [mid, size.y],
		style: "gray",
		alpha: 0.15 * sin(count * 0.08) + 0.5,
	})

	points.forEach((point) => {
		const motion = cos_wave(point.theta, point.x - mid, mid)
		const rotation = () => {
			if (point.x < mid) return -point.theta
			if (point.x > mid) return point.theta
			if (point.x == mid) return 1
		}
		// const transparency = sin_wave(theta, 0.5, 0.5)
		const transparency = sin_wave(rotation(), 0.5, 0.5)

		point.theta += degrees(3)

		draw_arc(context, {
			center: [motion, point.y],
			radius: 15,
			fill: { alpha: transparency }
		})
	})
}