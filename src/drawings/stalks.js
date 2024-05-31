import { cursor } from "../lib/controls.js"
import { fill_arc, stroke_arc } from "../lib/draws.js"
import { sin, abs, degrees, tau, random, floor, cos } from "../lib/math.js"

const stalks = []

export default (context, points, count) => {
	// add_point(random() * window.innerWidth, random() * window.innerHeight)

	points.forEach((point, index) => {
		const [x, y, radius, angle] = point

		const max = 20

		// for (let i = 0; i < max; i++) {
		// 	fill_arc(context, {
		// 		center: [x + cos(angle) * i * 10, y + sin(angle) * i * 10],
		// 		radius: max - i,
		// 		fill: `hsl(${count}, 100%, 50%)`,
		// 		alpha: i * 0.5 / max
		// 	})
		// }

		points.splice(index, 1)

		// point[2]++
		// if (radius > 20) points.splice(index, 1)

		// fill_arc(context, {
		// 	center: [x + cos(angle) * radius * 10, y + sin(angle) * radius * 10],
		// 	radius: 30 - radius,
		// 	fill: `hsl(${count}, 100%, 50%)`,
		// 	alpha: radius / 25
		// })
	})

	context.lineWidth = 0.2
	context.globalCompositeOperation = 'destination-over'
	context.shadowOffsetX = 0
	context.shadowOffsetY = 10
	context.shadowBlur = 10
	// context.shadowColor = 'rgba(0, 0, 0, 0.5)'

	class Root {
		constructor(x, y) {
			this.x = x
			this.y = y
			this.speed_x = Math.random() * 4 - 2
			this.speed_y = Math.random() * 4 - 2

			this.size = 0
			this.max_size = Math.random() * 7 + 20
			this.size_rate = Math.random() * 0.2 + 0.5

			this.angle = 0
			this.angle_x = Math.random() * 6.2
			this.angle_y = Math.random() * 6.2

			this.ang_vel = Math.random() * 0.02 + 0.05
			this.ang_vel_x = Math.random() * 0.6 - 0.3
			this.ang_vel_y = Math.random() * 0.6 - 0.3
		}
		update() {
			this.x += this.speed_x + Math.sin(this.angle_x)
			this.y += this.speed_y + Math.sin(this.angle_y)
			this.size += this.size_rate
			this.angle_x += this.ang_vel_x
			this.angle_y += this.ang_vel_y
			this.angle += this.ang_vel

			if (this.size < this.max_size) {
				context.save()

				context.translate(this.x, this.y)
				context.rotate(this.angle)

				context.fillStyle = "#FFF5DE"
				context.fillRect(0 - this.size / 2, 0 - this.size / 2, this.size, this.size)

				context.strokeStyle = '#3C5186'
				context.strokeRect(0 - this.size, 0 - this.size, this.size * 2, this.size * 2)

				context.strokeStyle = 'white'
				context.strokeRect(0 - this.size * 1.5, 0 - this.size * 1.5, this.size * 3, this.size * 3)

				context.restore()
			}
		}
	}

	cursor.held && stalks.push(new Root(cursor.x, cursor.y))
	stalks.forEach(stalk => stalk.update())

	// points.forEach((point, index) => {
	// 	const [x, y] = point
	// 	new Root(x, y).update()
	// points.splice(index, 1)
	// })
}

// class Root {
// 	constructor(x, y) {
// 		this.x = x
// 		this.y = y
// 		this.delta_x = rng(4, -2)
// 		this.delta_y = rng(4, -2)
// 		this.size = rng(1, 2)
// 		this.max_size = rng(7, 5)
// 		this.growth_rate = rng(0.2, 0.05)
// 		this.angle_rate = rng(0.6, -0.3)
// 		this.angle = 0
// 	}

// 	update() {
// 		this.x += this.delta_x + sin(this.angle)
// 		this.y += this.delta_y + sin(this.angle)
// 		this.size += this.growth_rate
// 		this.angle += this.angle_rate
// 		if (this.size < this.max_size) {
// 			context.beginPath()
// 			context.arc(this.x, this.y, this.size, 0, tau)
// 			context.fillStyle = "hsl(140, 100%, 50%)"
// 			context.fill()
// 			context.stroke()
// 			requestAnimationFrame(this.update.bind(this))
// 		}
// 	}
// }

// window.addEventListener("mousemove", (event) => {
// 	const root = new Root(event.x, event.y)
// 	cursor.held && root.update()
// })