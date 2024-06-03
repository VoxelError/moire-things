import { cursor } from "../lib/controls.js"
import { fill_arc } from "../lib/draws.js"
import { degrees, tau, random } from "../lib/math.js"
import { add_point } from "./_main.js"

export default (context, points, count) => {
	if (!cursor.show) {
		add_point(random() * window.innerWidth, random() * window.innerHeight)
	}

	points.forEach((point, index) => {
		const [x, y, theta] = point
		point[2] += degrees(3)

		if (theta > tau) {
			points.splice(index, 1)
			return
		}

		fill_arc(context, {
			center: [x, y],
			radius: (1 - theta / tau) * 100,
			fill: `hsl(${degrees(count) * 10}, 100%, 50%)`,
			alpha: (1 - theta / tau) / 5
		})
	})
}