import { draw_arc, stroke_line } from "../lib/draws"
import { cos_wave, degrees, sin, sin_wave } from "../lib/math"

export default (context, points, count) => {
	const mid = window.innerWidth / 2

	stroke_line(context, {
		start: [mid, 0],
		end: [mid, window.innerHeight],
		stroke: "gray",
		alpha: 0.15 * sin(count * 0.08) + 0.5,
	})

	points.forEach((point) => {
		const [x, y, theta] = point
		const motion = cos_wave(theta, x - mid, mid)
		const rotation = () => {
			if (x < mid) return -theta
			if (x > mid) return theta
			if (x == mid) return 1
		}
		// const transparency = sin_wave(theta, 0.5, 0.5)
		const transparency = sin_wave(rotation(), 0.5, 0.5)

		point[2] += degrees(3)

		draw_arc(context, {
			center: [
				motion,
				y
			],
			radius: 15,
			fill: {
				alpha: transparency,
			}
		})
	})
}