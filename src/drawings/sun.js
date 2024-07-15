import { cursor } from "../util/controls"
import { draw_arc, stroke_ellipse } from "../util/draws"
import { sin, tau } from "../util/math"

export default (context, count, points, size) => {
	cursor.held && points.push({
		x: cursor.x,
		y: cursor.y,
	})

	const circumference = size.x / 5 + sin(count / 25) * 50

	points.forEach((point) => {
		const sun = Math.atan2(point.y - size.y / 2, point.x - size.x / 2)

		context.setLineDash([100, 100])
		context.lineDashOffset = count * 10

		stroke_ellipse(context, {
			center: [
				size.x / 2,
				size.y / 2,
			],
			radii: [
				circumference,
				(size.y / 10) * 0.5,
			],
			rotation: sun,
			arc: [0, tau],
			stroke: "gray",
		})

		context.setLineDash([])
		context.lineDashOffset = 0
	})

	draw_arc(context, {
		center: [size.x / 2, size.y / 2],
		radius: 1,
		fill: {}
	})

	draw_arc(context, {
		center: [size.x / 2, size.y / 2],
		radius: circumference,
		stroke: {}
	})

	context.fillStyle = "white"
	context.font = "30px Arial"
	context.globalAlpha = 0.1
	context.fillText(points.length, 25, 50)
}