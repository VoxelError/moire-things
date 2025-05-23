import { cursor } from "../util/controls.js"
import { get_storage, render_pass, set_storage } from "../util/helpers.js"
import { tau } from "../util/math.js"
import shader from "../shaders/pendulum.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, points, gui } = props

	const settings = {
		clear: () => points.length = 0
	}

	gui.add(settings, "clear")

	const props_stride = 40

	const bob_pipeline = device.createRenderPipeline({
		layout: "auto",
		vertex: {
			module: device.createShaderModule({ code: shader }),
			entryPoint: "bob",
			buffers: [
				{ arrayStride: 8, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }] },
				{
					arrayStride: props_stride,
					stepMode: 'instance',
					attributes: [
						{ shaderLocation: 1, offset: 0, format: 'float32x2' },
						{ shaderLocation: 2, offset: 8, format: 'float32x2' },
						{ shaderLocation: 3, offset: 16, format: 'float32x4' },
						{ shaderLocation: 4, offset: 32, format: 'float32x2' },
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

	const string_pipeline = device.createRenderPipeline({
		layout: "auto",
		vertex: {
			module: device.createShaderModule({ code: shader }),
			entryPoint: "string",
			buffers: [
				{ arrayStride: 8, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }] },
				{
					arrayStride: props_stride,
					stepMode: 'instance',
					attributes: [
						{ shaderLocation: 1, offset: 0, format: 'float32x2' },
						{ shaderLocation: 2, offset: 8, format: 'float32x2' },
						{ shaderLocation: 3, offset: 16, format: 'float32x4' },
						{ shaderLocation: 4, offset: 32, format: 'float32x2' },
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

	const add_point = (time) => {
		points.push({
			x: cursor.x,
			y: cursor.y,
			delta: time,
		})
	}

	return (time) => {
		const sectors = 16
		const vertices = sectors * 3
		const vertex_data = new Float32Array(vertices * 2)
		const index_data = new Uint32Array(vertices * 3)

		const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

		const aspect = canvas.height / canvas.width

		cursor.left_held && add_point(time)
		cursor.right_click = () => add_point(time)

		vertex_data.set([0, 0])

		for (let i = 0; i < sectors; i++) {
			const ratio = i * tau / sectors

			vertex_data.set([
				ratio, 1,
			], 2 + i * 2)
		}

		for (let i = 1; i <= sectors; i++) {
			index_data.set([
				0, i, i == sectors ? 1 : i + 1,
			], 3 * (i - 1))
		}

		queue.writeBuffer(vertex_buffer, 0, vertex_data)
		queue.writeBuffer(index_buffer, 0, index_data)

		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		points.forEach((pendulum, i) => {
			pendulum.radius = 0.025

			instance_values.set([
				[pendulum.x, pendulum.y],
				[pendulum.radius, aspect],
				[i * 0.05 % 1, 1, 0.5, 0.5],
				[time, pendulum.delta],
			].flat(), i * props_stride / 4)
		})

		queue.writeBuffer(instance_buffer, 0, instance_values)

		const encoder = device.createCommandEncoder()
		const pass = render_pass(encoder, context, [0, 0, 0, 1])

		pass.setPipeline(bob_pipeline)
		pass.setVertexBuffer(0, vertex_buffer)
		pass.setVertexBuffer(1, instance_buffer)
		pass.setIndexBuffer(index_buffer, 'uint32')
		pass.drawIndexed(vertices, points.length)

		pass.setPipeline(string_pipeline)
		pass.setVertexBuffer(1, instance_buffer)
		pass.draw(6, points.length)

		pass.end()

		queue.submit([encoder.finish()])
	}
}