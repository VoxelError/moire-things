import { stroke_line } from "../lib/draws"
import { cos, degrees, sin, sin_wave } from "../lib/math"

export default (context, points) => {
	points.forEach((point) => {
		const [x, y, theta, length] = point

		point[2] += degrees(5)
		// point[2] += sin(degrees(count)) / 2 + 0.6
		// point[3] = (cos(theta) + 1) * 250

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * sin(theta)),
				y + (length * cos(theta))
				// x,
				// y + (length) - height / 2
			],
			width: 10,
			stroke: "grey",
			// cap: "round",
			// alpha: 0.25 * (sin(theta / sqrt(length * 0.15)) + 1),
			alpha: sin_wave(theta, 0.25, 0.35, 0.25),
			// alpha: 0.25,
		})
	})
}