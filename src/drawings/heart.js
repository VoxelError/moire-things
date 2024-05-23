import { stroke_curve2, stroke_line } from "../lib/draws"
import { abs, cos, cos_wave, degrees, sin } from "../lib/math"
import { width, height } from "./_main"

export default (context, count) => {
	const axis = {
		x: width / 2,
		y: height / 2
	}

	const point1 = { x: 300, y: 400 }
	const point2 = { x: 400, y: 0 }

	context.save()
	context.translate(axis.x, axis.y)
	context.scale(1, -1)

	// stroke_line(context, { start: [-axis.x, 0], end: [axis.x, 0], alpha: 0.1 })
	// stroke_line(context, { start: [0, -axis.y], end: [0, axis.y], alpha: 0.1 })

	const max = 100

	for (let i = 0; i < max; i++) {
		stroke_curve2(context, {
			start: [0, 200],
			end: [0, -200],
			control: [
				point1.x,
				point1.y,
				point2.x,
				point2.y
			],
			alpha: i * 5 / max,
			stroke: "red"
		})

		stroke_curve2(context, {
			start: [0, 200],
			end: [0, -200],
			control: [
				-point1.x,
				point1.y,
				-point2.x,
				point2.y
			],
			alpha: i * 5 / max,
			stroke: "red"
		})

		// const motion = 1 - abs(cos(degrees(count / 4))) / max * 2
		const motion = 1 - abs(cos_wave(degrees(count), 1, 0)) / max * 3

		context.scale(motion, motion)
	}

	context.restore()
}