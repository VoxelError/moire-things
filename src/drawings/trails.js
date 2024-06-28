import { cursor } from "../util/controls.js"
import { draw_arc } from "../util/draws.js"
import { degrees, tau, random } from "../util/math.js"
import { add_point } from "../App.jsx"

export default (size, context, points, count) => {
	if (!cursor.show) {
		add_point(random() * size.x, random() * size.y)
	}

	points.forEach((point, index) => {
		const [x, y, theta] = point
		point[2] += degrees(3)

		if (theta > tau) {
			points.splice(index, 1)
			return
		}

		draw_arc(context, {
			center: [x, y],
			radius: (1 - theta / tau) * 100,
			fill: {
				style: `hsl(${degrees(count) * 10}, 100%, 50%)`,
				alpha: (1 - theta / tau) / 5
			}
		})
	})
}