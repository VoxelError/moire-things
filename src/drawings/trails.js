import { cursor } from "../util/controls.js"
import { draw_arc } from "../util/draws.js"
import { degrees, tau, rng } from "../util/math.js"

export default (size, context, points, count) => {
	cursor.held && points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
	})

	!cursor.show && points.push({
		x: rng(size.x),
		y: rng(size.y),
		theta: 0,
	})

	points.forEach((point, index) => {
		point.theta += degrees(3)

		if (point.theta > tau) {
			points.splice(index, 1)
			return
		}

		draw_arc(context, {
			center: [point.x, point.y],
			radius: (1 - point.theta / tau) * 100,
			fill: {
				style: `hsl(${degrees(count) * 10}, 100%, 50%)`,
				alpha: (1 - point.theta / tau) / 5
			}
		})
	})
}