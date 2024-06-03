import { fill_arc, stroke_arc } from "../lib/draws"
import { abs, degrees, sin_wave } from "../lib/math"
import { cursor, drawing_mode } from "../lib/controls"

export default (context) => {
	const no_draw = ["heart", "larva", "sphere", "stare", "tree"]

	cursor.delta += degrees(2.5)
	context.setLineDash([5, 5])
	stroke_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius: abs(sin_wave(cursor.delta, cursor.size / 5))
	})

	if (no_draw.includes(drawing_mode)) return

	fill_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius: 2,
		fill: "gray"
	})
}