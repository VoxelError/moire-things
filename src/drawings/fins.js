import { fill_arc, stroke_line } from "../lib/draws"
import { abs, cos, cos_wave, degrees, rng, sin, sin_wave, sqrt, tau } from "../lib/math"
import { add_point } from "./_main"

export default (context, points, count) => {
	add_point(window.innerWidth / 2, window.innerHeight / 2, 0, rng(100, 50))
	add_point(window.innerWidth / 2, window.innerHeight / 2, 0, window.innerHeight * 0.45)

	points.forEach((point, index) => {
		const [x, y, theta, length] = point
		const unit = degrees(1)

		if (theta > tau - unit) {
			points.splice(index, 1)
			return
		} else point[2] += unit
		// point[2] += sin(degrees(count)) / 2 + 0.6
		// point[3] = (cos(theta) + 1) * 250

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * cos(theta)),
				// y + (length),
				y + (length * sin(theta)),
			],
			width: 10,
			cap: "round",
			// alpha: cos_wave(theta, 0.25, 0.25),
			// alpha: 0.25,
			stroke: `hsl(${cos_wave(theta, count)}, 100%, 50%)`
		})

		fill_arc(context, {
			center: [
				x + (length * sin(theta)),
				// y + (length)
				y + (length * cos(theta)),
			],
			radius: 2.5,
			alpha: 0
		})
	})
}