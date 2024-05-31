import { fill_arc } from "../lib/draws"
import { abs, cos_wave, degrees, sqrt, tau } from "../lib/math"

export default (context, points) => {
	points.forEach((point) => {
		const [x, y, theta] = point

		const gravity = 9.82
		const amplitude = window.innerHeight - y
		const motion = window.innerHeight - abs(cos_wave(theta, amplitude, 0, 1 / sqrt(amplitude / gravity)))
		// const motion = abs(cos(theta / sqrt(length * 0.15)) * y)
		// const motion = height - abs(cos_wave(theta / sqrt(height - y / gravity), height - y))

		point[2] += degrees(15)

		fill_arc(context, {
			center: [
				x,
				motion
			],
			radius: 15,
			alpha: 0.5,
		})
	})
}