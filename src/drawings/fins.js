import { cursor } from "../util/controls"
import { draw_arc, stroke_line } from "../util/draws"
import { cos, cos_wave, degrees, sin, tau } from "../util/math"

export default (size, context, points, count) => {
	cursor.held && points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
		length: size.y / 10
	})

	points.forEach((fin, index) => {
		fin.theta += degrees(3)

		stroke_line(context, {
			start: [
				fin.x - (fin.length * cos(fin.theta)),
				fin.y - (fin.length * sin(fin.theta)),
			],
			end: [
				fin.x + (fin.length * cos(fin.theta)),
				fin.y + (fin.length * sin(fin.theta)),
			],
			width: 8,
			cap: "round",
			alpha: 0.25,
			style: `hsl(${cos_wave(fin.theta, 360, 0, 0.25)}, 100%, 25%)`,
		})
	})
}