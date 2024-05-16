import { stroke_arc } from "../lib/draws"
import { abs, degrees, sin } from "../lib/math"
import { cursor } from "./_main"

export default (context) => {
	cursor.delta += degrees(1)
	stroke_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius: abs(sin(cursor.delta * 2.5) * cursor.size / 5)
	})
}