import { stroke_arc } from "../lib/draws"
import { cos, degrees, sin } from "../lib/math"
import { count, height, width } from "./_main"

export default (context, points) => {
	if (points.length > 6) points.length = 6
	points.forEach((point, index) => {
		const time = degrees(count) * (index + 1)

		point[2] = time / 100

		const unit = 5
		const max = 500

		// context.save()
		// if (index == 1) context.scale(1, 0.25)
		// if (index == 1) context.translate(0, height * 1.5)

		for (let i = unit; i <= max; i += unit) {
			stroke_arc(context, {
				center: [
					width / 2 + cos(point[2]) * (max - i),
					height / 2 - sin(point[2]) * (max - i)
					// width / 2,
					// height / 2
				],
				radius: i,
				alpha: 0.8 - i / max,
				stroke: "red"

			})
		}

		// context.restore()
	})

	context.fillStyle = "white"
	context.font = "30px Arial"
	context.globalAlpha = 0.1
	context.fillText(count, 25, 50)
}