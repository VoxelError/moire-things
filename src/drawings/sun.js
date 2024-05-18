import { fill_arc, stroke_arc, stroke_line } from "../lib/draws"
import { abs, cos, degrees, pi, sin, tau } from "../lib/math"
import { count, height, width } from "./_main"

export default (context, points) => {
	const circumference = width / 5 + sin(count / 25) * 50

	points.forEach((point, index) => {
		const [x, y] = point
		const sun = Math.atan2(y - height / 2, x - width / 2)

		context.beginPath()
		context.ellipse(
			width / 2,
			height / 2,
			circumference,
			(height / 10) * 0.5,
			sun,
			// tau * 0.25 /* + degrees(abs(sin(count / 50)) * 50) */ + pi,
			// tau * 0.75 /* - degrees(abs(sin(count / 50)) * 50) */ + pi
			0,
			tau
		)
		context.strokeStyle = "grey"
		context.setLineDash([100, 100])
		context.lineDashOffset = count * 10
		context.stroke()
		context.setLineDash([])
		context.lineDashOffset = 0
	})

	fill_arc(context, {
		center: [width / 2, height / 2],
		radius: 1
	})

	stroke_arc(context, {
		center: [width / 2, height / 2],
		radius: circumference
	})

	context.fillStyle = "white"
	context.font = "30px Arial"
	context.globalAlpha = 0.1
	context.fillText(points.length, 25, 50)
}