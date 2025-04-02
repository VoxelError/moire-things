import { render_pass } from "../util/helpers.js"
import { cursor } from "../util/controls.js"
import shader from "../shaders/pull.wgsl?raw"

export default (props) => {
	const { canvas, context, device, format, gui } = props

	const module = device.createShaderModule({ code: shader })

	const pipeline = device.createRenderPipeline({
		layout: 'auto',
		vertex: { module },
		fragment: {
			module,
			targets: [{ format }],
			constants: {
				width: canvas.width,
				height: canvas.height,
			}
		},
	})

	const cursor_data = new Float32Array(2)
	const cursor_buffer = device.createBuffer({
		size: cursor_data.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	})

	const aspect_data = new Float32Array([canvas.height / canvas.width])
	const aspect_buffer = device.createBuffer({
		size: aspect_data.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	})
	device.queue.writeBuffer(aspect_buffer, 0, aspect_data)

	const bind_group = device.createBindGroup({
		layout: pipeline.getBindGroupLayout(0),
		entries: [
			{ binding: 0, resource: { buffer: cursor_buffer } },
			{ binding: 1, resource: { buffer: aspect_buffer } },
		]
	})

	return () => {
		cursor_data.set([cursor.x, cursor.y])
		device.queue.writeBuffer(cursor_buffer, 0, cursor_data)

		const encoder = device.createCommandEncoder()

		const pass = render_pass(encoder, context, [0, 0, 0, 1])

		pass.setPipeline(pipeline)
		pass.setBindGroup(0, bind_group)
		pass.draw(6)
		pass.end()

		device.queue.submit([encoder.finish()])
	}
}