import { fill_arc } from "../lib/draws"
import { cos, degrees, sin, sqrt } from "../lib/math"

export default (context, points) => {
	const amplitude = degrees(30)

	points.forEach((point) => {
		const [x, y, theta] = point
		const length = 150
		const motion = sin(theta / sqrt(length * 0.15)) * amplitude

		point[2] += degrees(15)

		fill_arc(context, {
			center: [
				x + (length * sin(motion)),
				y - (length * cos(motion))
			],
			radius: 15,
			alpha: 0.25 * (cos(theta / sqrt(length * 0.15)) + 1.1),
			// alpha: 0.5,
		})
	})
}