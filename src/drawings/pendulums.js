import { cursor } from "../util/controls"
import { draw_arc, stroke_line } from "../util/draws"
import { cos, degrees, sin, sqrt } from "../util/math"

export default (context, count, points, size) => {
	cursor.held && points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
		length: 150,
	})

	cursor.right_click = () => points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
		length: 150,
	})

	const gravity = 9.82
	const amplitude = degrees(45)

	points.forEach((pendulum) => {
		const motion = cos(1 / sqrt(pendulum.length / gravity) * pendulum.theta) * amplitude

		pendulum.theta += degrees(10)

		stroke_line(context, {
			start: [pendulum.x, pendulum.y],
			end: [
				pendulum.x + (pendulum.length * sin(motion)),
				pendulum.y + (pendulum.length * cos(motion))
			],
			width: 8,
			style: "gray",
			cap: "round",
			// alpha: 0.5 * (sin(1 / sqrt(pendulum.length / gravity) * theta) + 1),
			alpha: 0.25,
		})

		draw_arc(context, {
			center: [
				pendulum.x + (pendulum.length * sin(motion)),
				pendulum.y + (pendulum.length * cos(motion))
			],
			radius: 15,
			fill: {
				// alpha: 0.5 * (sin(1 / sqrt(pendulum.length / gravity) * theta) + 1),
			}
		})
	})
}