import { draw_arc } from "../util/draws.js"
import { abs, degrees, rng, sign, tau } from "../util/math.js"

const init_pillar = (x, y, radius) => ({
	x: rng((x - radius) * 2, -(x - radius)),
	y: rng((y - radius) * 2, -(y - radius)),
	vx: rng(4, 1) * sign(rng(2, -1)),
	vy: rng(4, 1) * sign(rng(2, -1)),
	radius
})

let pillar
let hue = 0

export default (size, context, points, count) => {
	const radius = size.y * 0.1
	const half = {
		x: size.x / 2,
		y: size.y / 2
	}

	pillar ??= init_pillar(size.x / 2, size.y / 2, radius)

	context.translate(size.x / 2, size.y / 2)

	if (abs(pillar.x) >= size.x / 2 - pillar.radius) {
		pillar.vx *= -1
		pillar.vy = rng(4, 4) * sign(pillar.vy)
		hue += 10
	}

	if (abs(pillar.y) >= size.y / 2 - pillar.radius) {
		pillar.vy *= -1
		pillar.vx = rng(4, 4) * sign(pillar.vx)
		hue += 10
	}

	pillar.x += pillar.vx
	pillar.y += pillar.vy

	draw_arc(context, {
		center: [pillar.x, pillar.y],
		radius: pillar.radius,
		stroke: {
			width: 10,
			style: `hsl(${count * 0.2 + hue}, 100%, 50%)`
		},
		fill: {
			style: `hsl(${count * 0.2 + hue}, 75%, 50%)`
		}
	})

	draw_arc(context, {
		center: [pillar.x, pillar.y],
		radius: pillar.radius,
		stroke: {
			width: 10,
			cap: "round",
			style: "black",
			dash: [radius * tau / 16],
			offset: count * 10,
			alpha: 0.5
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

	context.translate(-size.x / 2, -size.y / 2)
}