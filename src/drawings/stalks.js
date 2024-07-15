import { cursor } from "../util/controls.js"
import { sin, degrees, tau, cos, rng } from "../util/math.js"

export default (context, count, points, size) => {
	context.lineWidth = 0.2
	context.globalCompositeOperation = 'destination-over'

	class Scube {
		constructor(x, y) {
			this.x = x
			this.y = y
			this.delta_x = rng(4, -2)
			this.delta_y = rng(4, -2)

			this.size = 0
			this.max_size = rng(7, 20)
			this.growth_rate = rng(0.2, 0.05)

			this.angle = 0
			this.angle_x = rng(6.2)
			this.angle_y = rng(6.2)

			this.ang_vel = rng(0.2, 0.05)
			this.ang_vel_x = rng(0.6, -0.3)
			this.ang_vel_y = rng(0.6, -0.3)
		}

		update() {
			this.x += this.delta_x + Math.sin(this.angle_x)
			this.y += this.delta_y + Math.sin(this.angle_y)
			this.size += this.growth_rate
			this.angle_x += this.ang_vel_x
			this.angle_y += this.ang_vel_y
			this.angle += this.ang_vel

			if (this.size < this.max_size) {
				context.save()

				context.translate(this.x, this.y)
				context.rotate(this.angle)

				context.globalAlpha = 0.25

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

	class Stalk {
		constructor(x, y) {
			this.x = x
			this.y = y
			this.delta_x = rng(4, -2)
			this.delta_y = rng(4, -2)
			this.size = rng(1, 2)
			this.max_size = rng(5, 15)
			this.growth_rate = rng(0.2, 0.05)
			// this.angle_rate = rng(0.6, -0.3)
			this.angle_rate = degrees(3)
			this.angle = 0
		}

		update() {
			this.x += this.delta_x + cos(this.angle)
			this.y += this.delta_y + sin(this.angle)
			this.size += this.growth_rate
			this.angle += this.angle_rate
			if (this.size < this.max_size) {
				context.beginPath()
				context.arc(this.x, this.y, this.size, 0, tau)
				context.fillStyle = `hsl(${(1 - this.size / this.max_size) * 360}, 100%, 50%)`
				context.fill()
			}
		}
	}

	cursor.held && points.push(new Scube(cursor.x, cursor.y))
	points.forEach((stalk) => stalk.update())
}