import { stroke_curve2, stroke_line } from "../util/draws"
import { abs, cos, cos_wave, degrees, sin } from "../util/math"

export default (size, context, points, count) => {
	const axis = {
		x: size.x / 2,
		y: size.y / 2
	}

	const point1 = { x: 3, y: 4 }
	const point2 = { x: 4, y: 0 }

	context.save()
	context.translate(size.x / 2, size.y / 2)
	context.scale(1, -1)

	// stroke_line(context, { start: [-axis.x, 0], end: [axis.x, 0], alpha: 0.1 })
	// stroke_line(context, { start: [0, -axis.y], end: [0, axis.y], alpha: 0.1 })

	const max = 100
	const scale = size.y / 8

	for (let i = 0; i < max; i++) {
		const transparency = i * 8 / max

		stroke_curve2(context, {
			start: [
				0 * scale,
				2 * scale,
			],
			end: [
				0 * scale,
				-2 * scale,
			],
			control: [
				point1.x * scale,
				point1.y * scale,
				point2.x * scale,
				point2.y * scale,
			],
			alpha: transparency,
			stroke: "red"
		})

		stroke_curve2(context, {
			start: [
				0 * scale,
				2 * scale,
			],
			end: [
				0 * scale,
				-2 * scale,
			],
			control: [
				-point1.x * scale,
				point1.y * scale,
				-point2.x * scale,
				point2.y * scale,
			],
			alpha: transparency,
			stroke: "red"
		})

		// const motion = 1 - abs(cos(degrees(count / 4))) / max * 2
		const motion = 1 - abs(cos_wave(degrees(count), 1, 0)) / max * 4

		context.scale(motion, motion)
	}

	context.restore()
}