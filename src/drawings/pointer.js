import { draw_arc, stroke_arc } from "../lib/draws"
import { abs, degrees, sin_wave } from "../lib/math"
import { cursor } from "../lib/controls"

export default (size, context) => {
	cursor.delta += degrees(2.5)
	context.setLineDash([5, 5])
	stroke_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius: abs(sin_wave(cursor.delta, cursor.size / 5))
	})

	draw_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius: 2,
		fill: {
			style: "gray"
		}
	})
}