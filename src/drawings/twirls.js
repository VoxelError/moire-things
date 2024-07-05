import { cursor } from "../util/controls"
import { stroke_line } from "../util/draws"
import { cos, degrees, sin, tau } from "../util/math"

export default (size, context, points, count) => {
	cursor.held && points.push({ x: cursor.x, y: cursor.y, theta: 0, length: size.y / 10 })

	points.forEach((point, index) => {
		const rotation = point.theta + (tau / 5) * index

		point.theta += degrees(1)

		stroke_line(context, {
			start: [point.x, point.y],
			end: [
				point.x + (point.length * sin(rotation)),
				point.y + (point.length * cos(rotation))
			],
			width: 5,
			style: "gray",
			cap: "round",
			alpha: 0.25,
		})
	})
}