import { draw_arc } from "../util/draws"
import { cos, cos_wave, degrees, sin } from "../util/math"

export default (size, context, points, count) => {
	const layers = 3

	for (let i = 0; i < layers; i++) {
		const time = degrees(count) * (i + 1)
		const theta = time * 0.1

		const unit = 2
		const max = size.y * 0.45

		for (let i = unit; i <= max; i += unit) {
			draw_arc(context, {
				center: [
					(size.x / 2) + cos(theta) * (max - i) * 0.75,
					(size.y / 2) - sin(theta) * (max - i) * 0.75,
					// width / 2,
					// height / 2
				],
				radius: i,
				stroke: {
					style: "red",
					alpha: 0.5 / layers,
					// alpha: 0.8 - i / max,
				}
			})
		}
	}

	// context.fillStyle = "white"
	// context.font = "30px Arial"
	// context.globalAlpha = 0.1
	// context.fillText(count, 25, 50)
}