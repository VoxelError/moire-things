import { draw_text, stroke_line } from "../util/draws"
import { ticks } from "../util/math"

const init = {
	root: { x: null, y: null },
	length: null,
	angle: 0,
	width: 15,
	alpha: 1,
	style: 0,
	depth: 1,
}

const hue = (value) => `hsl(${value}, 100%, 50%)`

const draw_tree = (size, context, points, count, args = init) => {
	let { root, length, angle, width, alpha, style, depth } = args

	root.x ??= size.x / 2
	root.y ??= size.y
	length ??= size.y * 0.2

	depth < 2 && (style = -count * 2)

	if (depth <= 11) {
		context.save()

		context.translate(root.x, root.y)
		context.rotate(angle)

		stroke_line(context, {
			start: [0, 0],
			end: [0, -length],
			width,
			cap: "round",
			style: hue(style),
			alpha,
		})

		draw_tree(size, context, points, count, {
			root: { x: 0, y: -length },
			length: length * 0.8,
			angle: angle + count * ticks(18000),
			width: width * 0.69,
			style: style + 10,
			alpha: 1,
			depth: depth + 1,
		})

		draw_tree(size, context, points, count, {
			root: { x: 0, y: -length },
			length: length * 0.8,
			angle: angle - count * ticks(18000),
			width: width * 0.69,
			style: style + 10,
			alpha: 1,
			depth: depth + 1,
		})

		context.restore()
	}
}

export default draw_tree