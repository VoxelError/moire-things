import { draw_arc } from "../lib/draws"
import { abs, degrees, pi, sin_wave, tau } from "../lib/math"
import { cursor } from "../lib/controls"

export default (size, context, points, count) => {
	if (!cursor.show) return

	// const radius = abs(sin_wave(cursor.delta, cursor.size))
	const radius = 100
	const circum = tau * radius

	cursor.delta += degrees(2.5)

	draw_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius,
		stroke: {
			dash: [
				circum / 16,
				circum / 16
			],
			offset: cursor.delta * 100
		}
	})
}