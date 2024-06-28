import { stroke_rect, stroke_square } from "../util/draws"

export default (size, context, points, count) => {
	points.forEach((point) => {
		const side = size.y * 0.1
		const speed = size.y * 0.01

		if (point[0] > size.x - side || point[0] < 0) { point[2] *= -1 }
		if (point[1] > size.y - side || point[1] < 0) { point[3] *= -1 }

		point[0] += point[2] * speed
		point[1] += point[3] * speed

		stroke_rect(context, {
			start: [point[0], point[1]],
			dims: [side, side],
			alpha: 0.25
		})

	})
}