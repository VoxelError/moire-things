import { fill_arc, stroke_line } from "../lib/draws"
import { cos_wave, degrees, sin, sin_wave } from "../lib/math"
import { count, height, width } from "./_main"

export default (context, points) => {
	const middle = width / 2

	stroke_line(context, {
		start: [middle, 0],
		end: [middle, height],
		stroke: "grey",
		alpha: 0.15 * sin(count * 0.08) + 0.5,
	})

	points.forEach((point) => {
		const [x, y, theta] = point
		const motion = cos_wave(theta, x - middle, middle)
		// const transparency = sin_wave(x < middle ? -theta : theta, 0.5, 0.5)
		const transparency = sin_wave(theta, 0.5, 0.5)

		point[2] += degrees(3)

		fill_arc(context, {
			center: [
				motion,
				y
			],
			radius: 15,
			alpha: transparency,
		})
	})
}