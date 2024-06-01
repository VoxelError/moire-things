import { fill_arc, stroke_line } from "../lib/draws"
import { cos, degrees, sin, sqrt } from "../lib/math"

export default (context, points) => {
	const gravity = 9.82
	const amplitude = degrees(45)

	points.forEach((point) => {
		const [x, y, theta] = point
		const length = 150
		const motion = cos(1 / sqrt(length / gravity) * theta) * amplitude

		point[2] += degrees(15)

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * sin(motion)),
				y + (length * cos(motion))
			],
			width: 8,
			stroke: "gray",
			cap: "round",
			// alpha: 0.5 * (sin(1 / sqrt(length / gravity) * theta) + 1),
			alpha: 0.25,
		})

		fill_arc(context, {
			center: [
				x + (length * sin(motion)),
				y + (length * cos(motion))
			],
			radius: 15,
			// alpha: 0.5 * (sin(1 / sqrt(length / gravity) * theta) + 1),
		})
	})
}