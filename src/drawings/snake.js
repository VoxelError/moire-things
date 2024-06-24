import { stroke_arc } from "../lib/draws"
import { degrees, sin_wave, tau } from "../lib/math"

export default (size, context, points) => {
	points.forEach((point) => {
		const [x, y, theta] = point
		const phase = sin_wave(2 * tau * theta, 0.5, 0.5)
		point[2] += degrees(3)

		stroke_arc(context, {
			center: [x, y],
			radius: 15 + phase * 10,
			// alpha: 0.5 * sin(theta * 2) + 0.5,
			alpha: phase,
		})
	})
}