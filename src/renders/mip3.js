const size = 512
const half = size / 2

const ctx = document.createElement('canvas').getContext('2d')
ctx.canvas.width = size
ctx.canvas.height = size
document.body.append(ctx.canvas)

const hsl = (h, s, l) => `hsl(${h * 360 | 0}, ${s * 100}%, ${l * 100 | 0}%)`

export function update(time) {
	ctx.reset()
	ctx.translate(half, half)

	const num = 33
	time *= 0.0005

	for (let i = 0; i < num; ++i) {
		ctx.fillStyle = hsl(
			(i * 0.2 / num) + (time * 0.1),
			1,
			(i % 2) * 0.5
		)

		ctx.fillRect(-half, -half, size, size)
		ctx.rotate(time * 0.5)
		ctx.scale(0.9, 0.9)
		// ctx.translate(size / 16, 0)
	}
}

// !function render(time) {
// 	update(time)
// 	requestAnimationFrame(render)
// }()