import { stroke_line } from "../lib/draws"
import { cos, cos_wave, degrees, sin, tau } from "../lib/math"

export default (context, points, count) => {
	points.forEach((point, index) => {
		const [x, y, theta] = point
		const length = 200

		point[2] += degrees(2)

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * cos(theta)),
				y + (length * sin(theta)),
			],
			width: 10,
			cap: "round",
			alpha: 0.5,
			stroke: `hsl(${theta * 360 / tau}, 100%, 50%)`,
			// stroke: `hsl(${cos_wave(theta, count)}, 100%, 50%)`,
		})
	})
}