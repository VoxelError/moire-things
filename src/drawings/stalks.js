import { cursor } from "../util/controls.js"
import { draw_arc } from "../util/draws.js"
import { sin, abs, degrees, tau, random, floor, cos, rng } from "../util/math.js"
import { add_point } from "../App.jsx"

const stalks = []

export default (size, context, points, count) => {
	add_point(rng(size.x), rng(size.y))

	// points.forEach((point, index) => {
	// 	const [x, y, radius, angle] = point

	// 	const max = 20

	// 	for (let i = 0; i < max; i++) {
	// 		draw_arc(context, {
	// 			center: [
	// 				x + cos(angle) * i * 10,
	// 				y + sin(angle) * i * 10
	// 			],
	// 			radius: max - i,
	// 			fill: {
	// 				style: `hsl(${count}, 100%, 50%)`,
	// 				alpha: i * 0.5 / max
	// 			}
	// 		})
	// 	}

	// 	points.splice(index, 1)

	// 	point[2]++
	// 	if (radius > 20) points.splice(index, 1)

	// 	draw_arc(context, {
	// 		center: [x + cos(angle) * radius * 10, y + sin(angle) * radius * 10],
	// 		radius: 30 - radius,
	// 		fill: {
	// 			style: `hsl(${count}, 100%, 50%)`,
	// 			alpha: radius / 25
	// 		}
	// 	})
	// })

	// ==========================================================================================

	// context.lineWidth = 0.2
	// context.globalCompositeOperation = 'destination-over'

	// cursor.held && stalks.push({
	// 	x: cursor.x,
	// 	y: cursor.y,
	// 	speed_x: rng(4, -2),
	// 	speed_y: rng(4, -2),

	// 	size: 0,
	// 	max_size: Math.random() * 7 + 20,
	// 	size_rate: Math.random() * 0.2 + 0.5,

	// 	angle: 0,
	// 	angle_x: Math.random() * 6.2,
	// 	angle_y: Math.random() * 6.2,

	// 	ang_vel: Math.random() * 0.02 + 0.05,
	// 	ang_vel_x: Math.random() * 0.6 - 0.3,
	// 	ang_vel_y: Math.random() * 0.6 - 0.3,
	// })
	// stalks.forEach((stalk) => {
	// 	stalk.x += stalk.speed_x + Math.sin(stalk.angle_x)
	// 	stalk.y += stalk.speed_y + Math.sin(stalk.angle_y)
	// 	stalk.size += stalk.size_rate
	// 	stalk.angle_x += stalk.ang_vel_x
	// 	stalk.angle_y += stalk.ang_vel_y
	// 	stalk.angle += stalk.ang_vel

	// 	if (stalk.size < stalk.max_size) {
	// 		context.save()

	// 		context.translate(stalk.x, stalk.y)
	// 		context.rotate(stalk.angle)

	// 		context.globalAlpha = 0.25

	// 		context.fillStyle = "#FFF5DE"
	// 		context.fillRect(0 - stalk.size / 2, 0 - stalk.size / 2, stalk.size, stalk.size)

	// 		context.strokeStyle = '#3C5186'
	// 		context.strokeRect(0 - stalk.size, 0 - stalk.size, stalk.size * 2, stalk.size * 2)

	// 		context.strokeStyle = 'white'
	// 		context.strokeRect(0 - stalk.size * 1.5, 0 - stalk.size * 1.5, stalk.size * 3, stalk.size * 3)

	// 		context.restore()
	// 	}
	// })

	// ==========================================================================================

	const Stalk = {
		x: cursor.x,
		y: cursor.y,
		delta_x: rng(4, -2),
		delta_y: rng(4, -2),
		size: rng(1, 2),
		max_size: rng(5, 15),
		growth_rate: rng(0.2, 0.05),
		// angle_rate: rng(0.6, -0.3),
		angle_rate: degrees(3),
		angle: 0,
	}

	const update = (root) => {
		root.x += root.delta_x + cos(root.angle)
		root.y += root.delta_y + sin(root.angle)
		root.size += root.growth_rate
		root.angle += root.angle_rate
		if (root.size < root.max_size) {
			context.beginPath()
			context.arc(root.x, root.y, root.size, 0, tau)
			context.fillStyle = `hsl(${(1 - root.size / root.max_size) * 360}, 100%, 50%)`
			context.fill()
		}
	}

	cursor.held && stalks.push(Stalk)
	
	stalks.forEach(update)
}