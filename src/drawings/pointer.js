import { fill_arc, stroke_arc } from "../lib/draws"
import { abs, degrees, sin } from "../lib/math"
import { cursor, drawing_mode } from "../lib/controls"

export default (context) => {
	cursor.delta += degrees(1)

	context.setLineDash([5, 5])

	stroke_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius: abs(sin(cursor.delta * 2.5) * cursor.size / 5)
	})

	context.setLineDash([])

	if (["Heart", "Larva", "Sphere", "Stare"].includes(drawing_mode)) return

	fill_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius: 2,
		fill: "gray"
	})
}