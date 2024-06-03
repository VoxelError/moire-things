import { cursor } from "../lib/controls.js"
import { fill_arc, stroke_arc } from "../lib/draws.js"
import { sin, abs, degrees, tau, random } from "../lib/math.js"

export default (context, points, count) => {
	// if (!cursor.show) {
	// add_point(random() * canvas_width, random() * window.innerHeight)
	// }

	// points.forEach((point, index) => {
	// 	const [x, y, theta] = point
	// 	point[2] += degrees(3)

	// 	if (theta > tau) {
	// 		points.splice(index, 1)
	// 		return
	// 	}

	// 	fill_arc(context, {
	// 		center: [x, y],
	// 		radius: (1 - theta / tau) * 100,
	// 		fill: `hsl(${degrees(count) * 10}, 100%, 50%)`,
	// 		alpha: (1 - theta / tau) / 5,
	// 	})
	// })

	points.forEach((point, index) => {
		const [x, y, time] = point
		point[2] += 1

		fill_arc(context, {
			center: [x, y],
			radius: 50,
			fill: `hsl(${degrees(count) * 10}, 100%, 50%)`
		})
		context.stroke()

		points.splice(index, 1)
	})
}