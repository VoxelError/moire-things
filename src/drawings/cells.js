import { draw_arc } from "../util/draws"
import { abs, cos_wave, degrees, pi, sin_wave, tau } from "../util/math"
import { cursor } from "../util/controls"

export default (context, count, points, size) => {
	const max = 200

	for (let i = 1; i <= max; i++) {
		// const radius = sin_wave(degrees(count + i * 4), max, max)
		const radius = i * 2
		const mouse = (cursor.x / size.x) * 10
		const slices = 16

		draw_arc(context, {
			center: [
				size.x / 2,
				size.y / 2
			],
			radius,
			stroke: {
				dash: [
					tau * radius / (slices * 2),
					tau * radius / (slices * 2),
				],
				offset: radius * degrees(count / 100) * (max / 2 - i),
				alpha: 1 - i / max,
			}
		})
	}
}