import { render_pass } from "../util/helpers.js"
import { sign, tau } from "../util/math.js"
import shader from "../shaders/slices.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, gui } = props

	const points = []

	let count = 0

	const settings = {
		restart: () => count = 0,
		pause: false,
	}

	gui.add(settings, "restart")
	gui.add(settings, "pause")

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

	const sectors = 128
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

	let skip = true
	const slices = 16

	for (let i = 0; i < sectors; i++) {
		const vertices = [0, 1, 2, 1, 2, 3]

		if (i % (0.5 * sectors / slices) == 0) skip = !skip
		if (skip) continue

		// if (i % 2 == 0) continue


		index_data.set(vertices.map(e => e + i * 2), i * 6)
	}

	queue.writeBuffer(vertex_buffer, 0, vertex_data)
	queue.writeBuffer(index_buffer, 0, index_data)

	const amount = 100

	for (let i = 0; i < amount; i++) {
		points[i] = {
			x: 0,
			y: 0,
		}
	}

	return () => {
		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		!settings.pause && count++

		points.forEach((cell, i) => {
			cell.radius = 0.9 * i / amount

			instance_values.set([
				[i, amount],
				[cell.radius, aspect],
				[sign(0.5 - i % 2) * count * 0.00005, i],
				[i / amount, 1, 0.85, 0.5],
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