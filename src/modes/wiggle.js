import { cursor } from "../util/controls.js"
import { render_pass } from "../util/helpers.js"
import { abs, cos, sign, sin, tau } from "../util/math.js"
import shader from "../shaders/wiggle.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, points, gui } = props

	gui.add({ clear: () => points.length = 0 }, "clear")

	const props_stride = 40

	const pipeline = device.createRenderPipeline({
		layout: "auto",
		vertex: {
			module: device.createShaderModule({ code: shader }),
			buffers: [
				{ arrayStride: 8, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }] },
				{
					arrayStride: props_stride,
					stepMode: 'instance',
					attributes: [
						{ shaderLocation: 1, offset: 0, format: 'float32x2' },
						{ shaderLocation: 2, offset: 8, format: 'float32x2' },
						{ shaderLocation: 3, offset: 16, format: 'float32x2' },
						{ shaderLocation: 4, offset: 24, format: 'float32x4' },
					]
				}
			]
		},
		fragment: {
			module: device.createShaderModule({ code: shader }),
			targets: [{
				format,
				blend: {
					color: {
						operation: 'add',
						srcFactor: 'one',
						dstFactor: 'one-minus-src-alpha',
					},
					alpha: {
						operation: 'add',
						srcFactor: 'one',
						dstFactor: 'one-minus-src-alpha',
					},
				}
			}]
		},
		// primitive: { topology: "line-list" },
	})

	const pin = {
		x: 0,
		y: 0,
	}

	const sectors = 16
	const vertices = sectors * 6
	const index_data = new Uint32Array(vertices)
	const vertex_data = new Float32Array(vertices * 2)

	const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

	const aspect = canvas.height / canvas.width

	for (let i = 0; i <= sectors; i++) {
		const ratio = i * tau / sectors

		vertex_data.set([
			ratio, 1,
			ratio, 0,
		], i * 4)

		if (i < sectors) index_data.set([0, 1, 2, 1, 2, 3].map(e => e + i * 2), i * 6)
	}

	const gravity = 9.8
	const damping = 0.9
	const traction = 0.8

	return () => {
		cursor.left_click = () => {
			const max = 2

			for (let i = 0; i < max; i++) {
				points[i] = {
					x: (cursor.x / canvas.width) * 2 - 1,
					y: -((cursor.y / canvas.height) * 2 - 1),
					vx: 0,
					vy: 0,
					animate: false,
				}
			}
		}

		queue.writeBuffer(vertex_buffer, 0, vertex_data)
		queue.writeBuffer(index_buffer, 0, index_data)

		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		points.forEach((bounce, i) => {
			bounce.radius = 0.05

			bounce.animate = cursor.left_held ? false : true

			if (cursor.left_held) {
				pin.x = (cursor.x / canvas.width) * 2 - 1
				pin.y = -((cursor.y / canvas.height) * 2 - 1)

				bounce.animate = false
			}

			(cursor.left_release = (pin) => {
				bounce.vx -= bounce.x - pin.x
				bounce.vy -= bounce.y - pin.y

				bounce.animate = true
			})(pin)

			if (bounce.animate) {
				bounce.vy -= (gravity / 60) / 66

				bounce.x += bounce.vx
				bounce.y += bounce.vy

				if (abs(bounce.x) > 1 - bounce.radius) {
					bounce.vx *= -damping
					bounce.x = sign(bounce.x) * (1 - bounce.radius)
				}
				if (abs(bounce.y) > 1 - bounce.radius) {
					bounce.vy *= -damping
					bounce.y = sign(bounce.y) * (1 - bounce.radius)
					if (sign(bounce.y) < 0) bounce.vx *= traction
				}
			}

			instance_values.set([
				[bounce.x, bounce.y],
				[bounce.radius, aspect],
				[bounce.vx, bounce.vy],
				[0, 1, 0.5, 0.5],
			].flat(), i * props_stride / 4)
		})

		queue.writeBuffer(instance_buffer, 0, instance_values)

		const encoder = device.createCommandEncoder()
		const pass = render_pass(encoder, context, [0, 0, 0, 1])

		pass.setPipeline(pipeline)
		pass.setVertexBuffer(0, vertex_buffer)
		pass.setVertexBuffer(1, instance_buffer)
		pass.setIndexBuffer(index_buffer, 'uint32')
		pass.drawIndexed(vertices, points.length)
		pass.end()

		queue.submit([encoder.finish()])
	}
}