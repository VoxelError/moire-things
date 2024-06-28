import { draw_arc } from "../util/draws"
import { cos, degrees, sin, sqrt, tau } from "../util/math"

export default (size, context, points, count) => {
	const amplitude = degrees(30)

	points.forEach((point) => {
		const [x, y, theta] = point
		const length = 150
		const motion = sin(theta / sqrt(length * 0.15)) * amplitude

		point[2] += degrees(15)

		draw_arc(context, {
			center: [
				x + (length * sin(motion)),
				y - (length * cos(motion)) + length
			],
			radius: 15,
			fill: {
				// alpha: 0.25 * (cos(theta / sqrt(length * 0.15)) + 1.1),
				style: `hsl(${(theta * 360 / tau) * 0.2}, 100%, 50%)`
			},
			stroke: { alpha: 0.5 }
		})
	})
}