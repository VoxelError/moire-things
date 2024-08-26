import { cursor } from "../util/controls.js"
import { get_storage, render_pass, set_storage } from "../util/helpers.js"
import shader from "../shaders/fins.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, points, gui } = props

	const settings = {
		clear: () => points.length = 0
	}

	gui.add(settings, "clear")

	const props_stride = 40

	const pipeline = device.createRenderPipeline({
		layout: "auto",
		vertex: {
			module: device.createShaderModule({ code: shader }),
			buffers: [
				{
					arrayStride: props_stride,
					stepMode: 'instance',
					attributes: [
						{ shaderLocation: 0, offset: 0, format: 'float32x2' },
						{ shaderLocation: 1, offset: 8, format: 'float32x2' },
						{ shaderLocation: 2, offset: 16, format: 'float32x4' },
						{ shaderLocation: 3, offset: 32, format: 'float32x2' },
					]
				},
				{ arrayStride: 8, attributes: [{ shaderLocation: 4, offset: 0, format: 'float32x2' }] },
				// { arrayStride: 8, attributes: [{ shaderLocation: 5, offset: 0, format: 'float32x2' }] },
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
		}
	})

	const vertices = 12
	const index_data = new Uint32Array(vertices)
	const vertex_data = new Float32Array(vertices * 2)

	vertex_data.set([
		+0.05, +2,
		-0.05, +2,
		+0.05, -2,
		-0.05, -2,
	])
	index_data.set([
		0, 1, 2,
		1, 2, 3,
	])

	const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

	queue.writeBuffer(vertex_buffer, 0, vertex_data)
	queue.writeBuffer(index_buffer, 0, index_data)

	const aspect = canvas.height / canvas.width

	return (time) => {
		if (cursor.left_held) {
			points.push({
				x: (cursor.x / canvas.width) * 2 - 1,
				y: -((cursor.y / canvas.height) * 2 - 1),
				delta: time,
			})
		}

		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		points.forEach((orb, i) => {
			orb.radius = 0.1

			instance_values.set([
				[orb.x, orb.y],
				[orb.radius, aspect],
				[orb.delta * 0.001 % 1, 0.5, 0.5, 0.5],
				[time, orb.delta],
			].flat(), i * props_stride / 4)
		})

		queue.writeBuffer(instance_buffer, 0, instance_values)

		const encoder = device.createCommandEncoder()
		const pass = render_pass(encoder, context, [0, 0, 0, 1])

		pass.setPipeline(pipeline)
		pass.setVertexBuffer(0, instance_buffer)
		pass.setVertexBuffer(1, vertex_buffer)
		pass.setIndexBuffer(index_buffer, 'uint32')
		pass.drawIndexed(vertices, points.length)
		pass.end()

		queue.submit([encoder.finish()])
	}
}