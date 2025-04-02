import { cursor } from "../util/controls.js"
import { get_storage, render_pass, set_storage } from "../util/helpers.js"
import shader from "../shaders/compass.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, points, gui } = props

	const aspect = canvas.height / canvas.width

	const max = 50

	for (let i = 0; i <= max; i++) {
		for (let j = 0; j <= max; j++) {
			points[50 * i + j] = {
				x: (i / max) * 2 - 1,
				y: (j / max) * 2 - 1,
				delta: 0,
			}
		}
	}

	const settings = {
		facing: true
	}
	gui.add(settings, "facing")

	const props_stride = 16
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
					]
				},
				// { arrayStride: 8, attributes: [{ shaderLocation: 3, offset: 0, format: 'float32x2' }] },
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

	const cursor_data = new Float32Array(2)
	const aspect_data = new Float32Array(1)
	const facing_data = new Uint32Array(1)

	const cursor_buffer = device.createBuffer({
		size: cursor_data.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	})
	const aspect_buffer = device.createBuffer({
		size: aspect_data.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	})
	const facing_buffer = device.createBuffer({
		size: facing_data.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	})

	const bind_group = device.createBindGroup({
		layout: pipeline.getBindGroupLayout(0),
		entries: [
			{ binding: 0, resource: { buffer: cursor_buffer } },
			{ binding: 1, resource: { buffer: aspect_buffer } },
			{ binding: 2, resource: { buffer: facing_buffer } },
		]
	})

	return (time) => {
		cursor_data.set([
			cursor.x,
			cursor.y,
		])
		aspect_data.set([aspect])
		facing_data.set([settings.facing ? 0 : 1])

		device.queue.writeBuffer(cursor_buffer, 0, cursor_data)
		device.queue.writeBuffer(aspect_buffer, 0, aspect_data)
		device.queue.writeBuffer(facing_buffer, 0, facing_data)

		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		points.forEach((leg, i) => {
			instance_values.set([
				[leg.x, leg.y],
				[time, leg.delta],
			].flat(), i * props_stride / 4)
		})

		queue.writeBuffer(instance_buffer, 0, instance_values)

		const encoder = device.createCommandEncoder()
		const pass = render_pass(encoder, context, [0, 0, 0, 1])

		pass.setPipeline(pipeline)
		pass.setBindGroup(0, bind_group)
		pass.setVertexBuffer(0, instance_buffer)
		pass.draw(3, points.length)
		pass.end()

		queue.submit([encoder.finish()])
	}
}