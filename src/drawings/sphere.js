import { stroke_arc, stroke_ellipse } from "../lib/draws"
import { sin_wave } from "../lib/math"
import { height, width } from "./_main"

export default (context, count) => {
	const axis = width / 5 + sin_wave(count, 10, 0, 0.05)

	const max = 15

	for (let i = 0; i < max; i++) {
		stroke_ellipse(context, {
			center: [
				width / 2,
				height / 2
			],
			radii: [
				axis,
				(axis * i / max)
			],
			alpha: (1 - i / max) * 0.5
		})

		stroke_ellipse(context, {
			center: [
				width / 2,
				height / 2
			],
			radii: [
				axis * i / max,
				axis
			],
			alpha: (1 - i / max) * 0.5
		})
	}

	stroke_arc(context, {
		center: [width / 2, height / 2],
		radius: axis,
		alpha: 0.15
	})
}