import { stroke_arc } from "../lib/draws"
import { abs, sin_wave } from "../lib/math"
import { cursor } from "../lib/controls"

export default (context) => {
	// cursor.delta += degrees(2.5)

	context.setLineDash([5, 5])

	stroke_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		// radius: abs(sin(cursor.delta) * cursor.size / 5)
		radius: abs(sin_wave(cursor.delta, cursor.size))
	})
}