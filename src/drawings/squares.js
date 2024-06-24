import { stroke_rect, stroke_square } from "../lib/draws"

export default (size, context, points) => {
	const speed = 25
	const dims = [
		size.x / 20,
		size.y / 20
	]

	points.forEach((point) => {
		if (point[0] > size.x - dims[0] || point[0] < 0) { point[2] *= -1 }
		if (point[1] > size.y - dims[1] || point[1] < 0) { point[3] *= -1 }

		point[0] += point[2] * speed
		point[1] += point[3] * speed

		stroke_rect(context, {
			start: [point[0], point[1]],
			dims,
			alpha: 0.5
		})

	})
}