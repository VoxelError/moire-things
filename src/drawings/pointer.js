import { draw_arc, stroke_arc } from "../util/draws"
import { abs, degrees, sin_wave } from "../util/math"
import { cursor } from "../util/controls"

const pos = {}
let delta = 0

export default (size, context, points, count) => {
	pos.x ??= size.x / 2
	pos.y ??= size.y / 2

	delta += degrees(1)

	draw_arc(context, {
		center: [pos.x, pos.y],
		radius: 2,
		fill: { style: "gray" }
	})

	draw_arc(context, {
		center: [pos.x, pos.y],
		radius: abs(sin_wave(delta, cursor.size)),
		stroke: { dash: [10, 10] }
	})
}