import { draw_arc } from "../util/draws"
import { cos, cos_wave, degrees, sin, tau } from "../util/math"

export default (size, context, points, count) => {
	const larvae = 7

	for (let l = 0; l < larvae; l++) {
		const time = degrees(count) * l
		const theta = time * 0.1

		const layers = size.y * 0.45
		const gap = 4

		for (let i = gap; i <= layers; i += gap) {
			draw_arc(context, {
				center: [
					(size.x / 2) + cos(theta) * (layers - i),
					(size.y / 2) - sin(theta) * (layers - i),
					// width / 2,
					// height / 2
				],
				radius: i,
				stroke: {
					style: "red",
					alpha: 1 / larvae,
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