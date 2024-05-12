// const mass = 50
// const length = 400
// const origin = { x: 0, y: 0 }
// const r = 0

// class Pendulum {
// 	constructor() {
// 		this.position = createVector()
// 		this.angle = PI / 4

// 		this.aVelocity = 0.0
// 		this.aAcceleration = 0.0
// 		this.damping = 0.9945 * mass

// 		const gravity = 0.1 * 9.82
// 		this.damping = 0.995 - 0.0003 * mass / 3
// 		this.aAcceleration = (-gravity / r) * sin(this.angle)
// 		this.aVelocity += this.aAcceleration
// 		this.aVelocity *= this.damping
// 		this.angle += this.aVelocity

// 		this.display = function () {
// 			this.position.set(length * sin(this.angle), length * cos(this.angle), 0)
// 			this.position.add(origin)

// 			stroke('#e0ad16')
// 			strokeWeight(2)
// 			line(origin.x, origin.y, this.position.x, this.position.y)
// 		}
// 	}
// }

