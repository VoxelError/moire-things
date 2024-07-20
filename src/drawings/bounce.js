import { cursor } from "../util/controls"
import { draw_arc, stroke_line } from "../util/draws"
import { abs, cos, pi, sign, sin, sin_wave } from "../util/math"

export default (context, count, points, size) => {
	const clip = {
		x: cursor.x - size.x / 2,
		y: cursor.y - size.y / 2,
	}

	cursor.held && points.push({
		x: clip.x / 2,
		y: clip.y / 2,
		vx: cos(Math.atan2(clip.y, clip.x)) * 5,
		vy: sin(Math.atan2(clip.y, clip.x)) * 5,
		r: sin_wave(count, 10, 40, 0.05),
	})

	context.translate(size.x / 2, size.y / 2)

	draw_arc(context, {
		center: [0, 0],
		radius: sin_wave(count, 2.5, 10, 0.025),
		stroke: { alpha: 0.25 },
	})

	draw_arc(context, {
		center: [clip.x / 2, clip.y / 2],
		radius: 5,
		stroke: { alpha: 0.25 },
	})

	stroke_line(context, {
		start: [0, 0],
		end: [clip.x, clip.y],
		alpha: 0.25
	})

	points.forEach((bounce) => {
		if (abs(bounce.x) >= size.x / 2 + 50) {
			bounce.x = (size.x / 2 + 50) * -sign(bounce.x)
			// bounce.x = (size.x / 2 - bounce.r) * sign(bounce.x)
			// bounce.vx *= -1
		}

		if (abs(bounce.y) >= size.y / 2 + 50) {
			bounce.y = (size.y / 2 + 50) * -sign(bounce.y)
			// bounce.y = (size.y / 2 - bounce.r) * sign(bounce.y)
			// bounce.vy *= -1
		}

		bounce.x += bounce.vx
		bounce.y += bounce.vy

		draw_arc(context, {
			center: [
				bounce.x,
				bounce.y,
			],
			radius: bounce.r,
			stroke: {
				alpha: 0.25,
				style: `hsl(${bounce.y * 180 / size.y}, 100%, 50%)`
			},
		})
	})
}