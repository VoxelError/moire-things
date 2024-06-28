import { stroke_line } from "../util/draws"
import { cos, degrees, sin, tau } from "../util/math"

export default (size, context, points, count) => {
	points.forEach((point, index) => {
		const [x, y, theta] = point
		const length = 200
		const rotation = theta + (tau / 5) * index

		point[2] += degrees(1)

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * sin(rotation)),
				y + (length * cos(rotation))
			],
			width: 10,
			style: "gray",
			cap: "round",
			alpha: 0.25,
		})
	})
}