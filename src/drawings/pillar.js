import { draw_arc } from "../lib/draws.js"
import { abs, degrees, rng, sign } from "../lib/math.js"

const half = {
	x: window.innerWidth / 2,
	y: window.innerHeight / 2
}

const radius = 100

const pillar = {
	x: rng((half.x - radius) * 2, -(half.x - radius)),
	y: rng((half.y - radius) * 2, -(half.y - radius)),
	vx: rng(4, 1) * sign(rng(2, -1)),
	vy: rng(4, 1) * sign(rng(2, -1)),
	radius
}

// document.addEventListener("mousedown", (event) => {
// 	pillar.x = event.pageX - half.x
// 	pillar.y = event.pageY - half.y
// })

export default (context, points, count) => {
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