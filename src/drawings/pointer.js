import { fill_arc, stroke_arc } from "../lib/draws"
import { abs, degrees, sin } from "../lib/math"
import { cursor } from "../lib/controls"

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

	fill_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius: 2,
		fill: "grey"
	})

	context.setLineDash([])
}