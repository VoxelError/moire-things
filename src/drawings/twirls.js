import { stroke_line } from "../lib/draws"
import { cos, degrees, sin } from "../lib/math"

export default (context, points) => {
	points.forEach((point) => {
		const [x, y, theta] = point
		const motion = sin(theta)
		const length = 150

		point[2] += degrees(30)
		// point[2] += sin(degrees(count)) / 2 + 0.6
		// point[3] = (cos(theta) + 1) * 250

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * sin(motion)),
				y + (length * cos(motion))
				// x,
				// y + (length) - height / 2
			],
			width: 10,
			stroke: "gray",
			// cap: "round",
			// alpha: 0.25 * (sin(theta / sqrt(length * 0.15)) + 1),
			// alpha: sin_wave(theta / sqrt(length * 0.15), 0.25, 0.35),
			alpha: 0.25,
		})
	})
}