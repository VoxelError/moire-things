import { stroke_line } from "../lib/draws"
import { cos, cos_wave, pi, sin, tau } from "../lib/math"

const counter = {
	value: 0,
	delta: 1
}

export default (context, points, count) => {
	const range = (min, max) => cos_wave(count, max / 2, max / 2 + min, 0.001, pi)

	counter.value = range(1, 1000)

	const max = counter.value
	const x = window.innerWidth / 2
	const y = window.innerHeight / 2
	let theta = 0

	context.globalCompositeOperation = "difference"

	for (let i = 0; i < max; i++) {
		const length = (window.innerWidth) * (1 - 0.2 * i / max)

		theta += tau / max

		stroke_line(context, {
			start: [x, y],
			end: [
				x + (length * cos(theta)),
				y + (length * sin(theta)),
			],
			cap: "round",
			alpha: 0.5,
			stroke: `hsl(${theta * 360 / tau}, 100%, 50%)`,
			// stroke: `hsl(${cos_wave(theta, count)}, 100%, 50%)`,
		})
	}
}