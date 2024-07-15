import { cursor } from "../util/controls"
import { draw_arc } from "../util/draws"
import { cos, degrees, rng, sin, sqrt, tau } from "../util/math"

export default (context, count, points, size) => {
	cursor.held && points.push({
		x: cursor.x,
		y: cursor.y,
		theta: 0,
		amp: degrees(30),
		length: 150,
	})

	points.forEach((orb) => {
		const motion = sin(orb.theta / sqrt(orb.length * 0.15)) * orb.amp

		orb.theta += degrees(15)

		draw_arc(context, {
			center: [
				orb.x + (orb.length * sin(motion)),
				orb.y - (orb.length * cos(motion)) + orb.length
			],
			radius: 15,
			fill: {
				// alpha: 0.25 * (cos(theta / sqrt(length * 0.15)) + 1.1),
				style: `hsl(${(orb.theta * 360 / tau) * 0.2}, 100%, 50%)`,
				alpha: 0.5,
			},
			// stroke: { alpha: 0.5 }
		})
	})
}