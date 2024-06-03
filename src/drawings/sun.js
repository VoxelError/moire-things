import { fill_arc, stroke_arc, stroke_ellipse } from "../lib/draws"
import { sin, tau } from "../lib/math"

export default (context, points, count) => {
	const circumference = window.innerWidth / 5 + sin(count / 25) * 50

	points.forEach((point, index) => {
		const [x, y] = point
		const sun = Math.atan2(y - window.innerHeight / 2, x - window.innerWidth / 2)

		context.setLineDash([100, 100])
		context.lineDashOffset = count * 10

		stroke_ellipse(context, {
			center: [
				window.innerWidth / 2,
				window.innerHeight / 2,
			],
			radii: [
				circumference,
				(window.innerHeight / 10) * 0.5,
			],
			rotation: sun,
			arc: [
				0,
				tau,
			],
			stroke: "gray",
		})

		context.setLineDash([])
		context.lineDashOffset = 0
	})

	fill_arc(context, {
		center: [window.innerWidth / 2, window.innerHeight / 2],
		radius: 1
	})

	stroke_arc(context, {
		center: [window.innerWidth / 2, window.innerHeight / 2],
		radius: circumference
	})

	context.fillStyle = "white"
	context.font = "30px Arial"
	context.globalAlpha = 0.1
	context.fillText(points.length, 25, 50)
}