import { fill_arc, stroke_arc, stroke_curve1, stroke_curve2, stroke_line } from "../lib/draws"
import { abs, cos, cos_wave, degrees, pi, sin, sin_wave } from "../lib/math"

export default (context, count) => {
	const axis = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2
	}

	const control = 300 + sin_wave(degrees(count), 10, 10)

	context.save()
	context.translate(axis.x, axis.y)
	context.scale(1, -1)

	// stroke_line(context, { start: [-axis.x, 0], end: [axis.x, 0], alpha: 0.1 })
	// stroke_line(context, { start: [0, -axis.y], end: [0, axis.y], alpha: 0.1 })

	const max = 10

	stroke_curve1(context, {
		start: [300, 300],
		end: [-300, -300],
		control: [control, -control],
		width: 5,
		cap: "round",
	})

	stroke_curve1(context, {
		start: [300, 300],
		end: [-300, -300],
		control: [-control, control],
		width: 5,
		cap: "round",
	})

	stroke_arc(context, {
		center: [0, 0],
		radius: sin_wave(degrees(count), 2.5, 15, 1, pi),
		width: 4,
	})

	stroke_arc(context, {
		center: [175, -175],
		radius: sin_wave(degrees(count), 2.5, 5),
		width: 2.5,
	})

	stroke_arc(context, {
		center: [-175, 175],
		radius: sin_wave(degrees(count), 2.5, 5),
		width: 2.5,
	})

	context.restore()
}