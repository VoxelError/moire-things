import { stroke_line } from "../util/draws"
import { cos, cos_wave, pi, sin, tau } from "../util/math"

const counter = {
	value: 0,
	delta: 1
}

export default (context, count, points, size) => {
	const range = (min, max) => cos_wave(count, max / 2, max / 2 + min, 0.005, pi)

	counter.value = range(1, 250)

	const max = counter.value
	const x = size.x / 2
	const y = size.y / 2
	let theta = 0

	context.globalCompositeOperation = "difference"

	for (let i = 0; i < max; i++) {
		const length = (size.y * 0.45)
		theta += tau / max

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * cos(theta)),
				y + (length * sin(theta)),
			],
			cap: "round",
			alpha: 0.5,
			style: `hsl(${theta * 360 / tau}, 100%, 50%)`,
			// stroke: `hsl(${cos_wave(theta, count)}, 100%, 50%)`,
		})
	}
}