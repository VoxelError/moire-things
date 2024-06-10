import { stroke_line } from "../lib/draws"
import { cos, degrees, sin } from "../lib/math"

export default (context, points) => {
	points.forEach((point) => {
		const [x, y, theta] = point
		const length = 100

		point[2] += degrees(70)

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * sin(theta)),
				y + (length * cos(theta))
			],
			width: 10,
			stroke: "gray",
			cap: "round",
			alpha: 0.25,
		})
	})
}