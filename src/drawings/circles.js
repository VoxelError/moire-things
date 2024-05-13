import { stroke_arc } from "../draw_tools.js"
import { sin, abs, degrees } from "../math.js"
import { width, height } from "./pendulums"

// abs, sin, degrees, stroke_arc, height
export default (context, points) => {
	points.forEach((point) => {
		const [x, y] = point
		const phase = abs(sin((point[2])))
		point[2] += degrees(3)

		stroke_arc(context, {
			center: [x, y],
			radius: phase * height * 0.1,
			// alpha: 1 - phase,
			alpha: phase * 0.5,

		})
	})
}