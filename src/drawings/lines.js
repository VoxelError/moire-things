import { draw_arc, stroke_line } from "../util/draws"
import { abs, cos, cos_wave, degrees, pi, sin, sin_wave, tau } from "../util/math"
import { cursor } from "../util/controls"

export default (size, context, points, count) => {
	context.globalCompositeOperation = ""

	points.forEach((point, index) => {
		if (index > points.length - 2) return

		const [x, y, theta] = point

		point[2] += degrees(5)

		stroke_line(context, {
			start: [
				index > 0 ? points[index - 1][0] : x,
				index > 0 ? points[index - 1][1] : y,
			],
			end: [x, y],
			width: cos_wave(theta, 16, 16, 1, pi),
			cap: "round",
			alpha: 0.25
		})
	})
}