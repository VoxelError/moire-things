import { fill_arc } from "../lib/draws"
import { abs, cos_wave, degrees, sqrt, tau } from "../lib/math"

export default (context, points) => {
	points.forEach((point) => {
		const [x, y, vel_y, height] = point

		const radius = 15
		const gravity = 0.982
		const damping = 0.9
		// const motion = window.innerHeight - abs(cos_wave(vel_y, height, 0, 1 / sqrt(height / gravity)))
		// const motion = abs(cos(theta / sqrt(length * 0.15)) * y)
		// const motion = height - abs(cos_wave(theta / sqrt(height - y / gravity), height - y))

		if (y >= window.innerHeight - radius) {
			// point[2] *= -damping
			// point[1] = window.innerHeight - radius
			point[1] = 0
		}

		point[2] += gravity

		point[1] += vel_y

		fill_arc(context, {
			center: [
				x,
				y
			],
			radius: radius,
			alpha: 0.5,
			// fill: theta > tau * 2 ? "red" : "white"
		})
	})
}