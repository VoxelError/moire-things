import { draw_arc } from "../lib/draws.js"
import { abs, degrees, rng, sign } from "../lib/math.js"

const radius = 100

const init_pillar = (x, y) => ({
	x: rng((x - radius) * 2, -(x - radius)),
	y: rng((y - radius) * 2, -(y - radius)),
	vx: rng(4, 1) * sign(rng(2, -1)),
	vy: rng(4, 1) * sign(rng(2, -1)),
	radius
})

// document.addEventListener("mousedown", (event) => {
// 	pillar.x = event.pageX - half.x
// 	pillar.y = event.pageY - half.y
// })

let pillar

export default (size, context, points, count) => {
	const half = {
		x: size.x / 2,
		y: size.y / 2
	}

	pillar ??= init_pillar(half.x, half.y)

	context.translate(half.x, half.y)

	if (abs(pillar.x) >= half.x - pillar.radius) {
		pillar.vx *= -1
		pillar.vy = rng(4, 1) * sign(pillar.vy)
	}

	if (abs(pillar.y) >= half.y - pillar.radius) {
		pillar.vy *= -1
		pillar.vx = rng(4, 1) * sign(pillar.vx)
	}

	pillar.x += pillar.vx
	pillar.y += pillar.vy

	draw_arc(context, {
		center: [pillar.x, pillar.y],
		radius: pillar.radius,
		fill: {
			style: "black",
			alpha: 0.01
		},
		stroke: {
			width: 10,
			style: `hsl(${degrees(count) * 10}, 100%, 50%)`
		}
	})

	// points.forEach((point, index) => {
	// 	draw_arc(context, {
	// 		center: [point[0], point[1]],
	// 		radius: 100,
	// 		fill: {
	// 			style: "black",
	// 			alpha: 0.01
	// 		},
	// 		stroke: {
	// 			width: 10,
	// 			style: `hsl(${degrees(count) * 10}, 100%, 50%)`
	// 		}
	// 	})

	// 	points.splice(index, 1)
	// })

	context.translate(-half.x, -half.y)
}