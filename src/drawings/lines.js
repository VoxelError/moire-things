import { draw_arc, stroke_line } from "../util/draws"
import { abs, cos, cos_wave, degrees, pi, sin, sin_wave, tau } from "../util/math"
import { cursor } from "../util/controls"

export default (context, count, points, size) => {
	cursor.held_left && points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
	})

	points.forEach((line, index) => {
		if (index > points.length - 2) return

		line.theta += degrees(5)

		stroke_line(context, {
			start: [
				index > 0 ? points[index - 1].x : line.x,
				index > 0 ? points[index - 1].y : line.y,
			],
			end: [line.x, line.y],
			width: cos_wave(line.theta, 4, 8, 0.1, pi),
			alpha: 0.25
		})
	})
}