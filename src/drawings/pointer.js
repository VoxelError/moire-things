import { get_draw_mode } from "../controls"
import { stroke_arc } from "../draw_tools"
import { abs, degrees, sin } from "../math"
import { cursor } from "./pendulums"

export default (context) => {
	if (get_draw_mode() == 101) return

	cursor.delta += degrees(1)
	stroke_arc(context, {
		center: [
			cursor.x,
			cursor.y
		],
		radius: abs(sin(cursor.delta * 2.5) * cursor.size / 5)
	})
}