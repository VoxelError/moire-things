import { stroke_line } from "../lib/draws"
import { degrees } from "../lib/math"

const init = {
	root: {
		x: window.innerWidth / 2,
		y: window.innerHeight - 160
	},
	length: 160,
	angle: 0,
	width: 15,
	alpha: 1
}

const draw_tree = (context, count, args = init) => {
	const { root, length, angle, width, alpha } = args
	const start = 36096

	if (length < 10) return

	context.save()

	context.translate(root.x, root.y)
	context.rotate(degrees(angle))

	stroke_line(context, {
		start: [0, 0],
		end: [0, -length],
		width,
		cap: "round",
		alpha,
	})

	draw_tree(context, count, {
		root: { x: 0, y: -length },
		length: length * 0.8,
		angle: angle + degrees(count),
		width: width * 0.69,
		alpha: 1
	})

	draw_tree(context, count, {
		root: { x: 0, y: -length },
		length: length * 0.8,
		angle: angle - degrees(count),
		width: width * 0.69,
		alpha: 1
	})

	context.restore()
}

export default draw_tree