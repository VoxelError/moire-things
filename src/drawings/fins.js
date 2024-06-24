import { stroke_line } from "../lib/draws"
import { cos, cos_wave, degrees, sin, tau } from "../lib/math"

export default (size, context, points, count) => {
	points.forEach((point, index) => {
		const [x, y, theta] = point
		const length = 200
		const rotation = theta + (tau / 5) * index

		point[2] += degrees(1)

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * cos(rotation)),
				y + (length * sin(rotation)),
			],
			width: 10,
			cap: "round",
			alpha: 0.25,
			style: `hsl(${cos_wave(theta, 360, 0, 0.25)}, 100%, 50%)`,
			// stroke: `hsl(${cos_wave(theta, count)}, 100%, 50%)`,
		})
	})
}