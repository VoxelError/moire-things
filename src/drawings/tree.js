import { stroke_line } from "../lib/draws"
import { degrees } from "../lib/math"

const init = {
	root: {},
	length: -1,
	angle: 0,
	width: 15,
	alpha: 1,
	style: 0,
	depth: 0,
}

const hue = (value) => `hsl(${value}, 100%, 50%)`

const draw_tree = (size, context, count, args = init) => {
	const { root, length, angle, width, alpha, style, depth } = args
	// const start = 36096

	init.root.x ??= size.x / 2
	init.root.y ??= size.y
	init.length == -1 && (init.length = size.y * 0.2)
	init.style += degrees(0.015)

	if (depth > 11) return

	context.save()

	context.translate(root.x, root.y)
	context.rotate(degrees(angle))
	// context.scale(0.5, 0.5)

	stroke_line(context, {
		start: [0, 0],
		end: [0, -length],
		width,
		cap: "round",
		style: hue(style),
		alpha,
	})

	draw_tree(size, context, count, {
		root: { x: 0, y: -length },
		length: length * 0.8,
		angle: angle + degrees(count),
		width: width * 0.69,
		style: style + 10,
		alpha: 1,
		depth: depth + 1,
	})

	draw_tree(size, context, count, {
		root: { x: 0, y: -length },
		length: length * 0.8,
		angle: angle - degrees(count),
		width: width * 0.69,
		style: style + 10,
		alpha: 1,
		depth: depth + 1,
	})

	context.restore()
}

export default draw_tree