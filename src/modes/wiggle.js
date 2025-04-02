import { cursor } from "../util/controls.js"
import { render_pass } from "../util/helpers.js"
import { abs, cos, sign, sin, tau } from "../util/math.js"
import shader from "../shaders/wiggle.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, gui } = props

	const points = []

	const settings = {
		clear: () => points.length = 0,
		gravity: 9.8,
	}

	gui.add(settings, "clear")
	gui.add(settings, "gravity", 0, 20, 0.2)

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

	const sectors = 32
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
	}

	for (let i = 0; i < sectors; i++) {
		const indices = [0, 1, 2, 1, 2, 3]
		index_data.set(indices.map(e => e + i * 2), i * 6)
	}

	const damping = 0.5
	const traction = 0.99

	const max = 1

	for (let i = 0; i < max; i++) {
		points[i] = {
			x: 0,
			y: -1,
			vx: 0,
			vy: 0,
			animate: false,
		}
	}

	return () => {
		queue.writeBuffer(vertex_buffer, 0, vertex_data)
		queue.writeBuffer(index_buffer, 0, index_data)

		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		points.forEach((wiggle, i) => {
			wiggle.radius = 0.1

			if (cursor.left_held) {
				pin.x = cursor.x
			}

			wiggle.vx = wiggle.vx - (wiggle.x - pin.x)
			// wiggle.vx *= traction

			wiggle.x += wiggle.vx
			wiggle.y = wiggle.radius - 1

			instance_values.set([
				[wiggle.x, wiggle.y],
				[wiggle.radius, aspect],
				[wiggle.vx, wiggle.vy],
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