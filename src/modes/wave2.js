import { render_pass } from "../util/helpers.js"
import { cursor } from "../util/controls.js"
import shader from "../shaders/wave2.wgsl?raw"

export default (props) => {
	const { canvas, context, device, format, gui } = props

	gui.hide()

	const module = device.createShaderModule({ code: shader })

	// const compute = device.createComputePipeline({ layout: "auto", compute: { module } })

	// const compute_data = new Float32Array(2)
	// const compute_buffer = device.createBuffer({
	// 	size: compute_data.byteLength,
	// 	usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
	// })

	const render = device.createRenderPipeline({
		layout: 'auto',
		vertex: { module },
		fragment: {
			module,
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
			}],
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

	const time_data = new Float32Array(1)
	const time_buffer = device.createBuffer({
		size: cursor_data.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	})

	const bind_group = device.createBindGroup({
		layout: render.getBindGroupLayout(0),
		entries: [
			{ binding: 0, resource: { buffer: cursor_buffer } },
			{ binding: 1, resource: { buffer: aspect_buffer } },
			{ binding: 2, resource: { buffer: time_buffer } },
		]
	})

	return (time) => {
		cursor_data.set([
			cursor.x,
			cursor.y,
		])
		device.queue.writeBuffer(cursor_buffer, 0, cursor_data)

		time_data.set([time])
		device.queue.writeBuffer(time_buffer, 0, time_data)

		const encoder = device.createCommandEncoder()
		const pass = render_pass(encoder, context, [0, 0, 0, 1])

		pass.setPipeline(render)
		pass.setBindGroup(0, bind_group)
		pass.draw(6)
		pass.end()

		device.queue.submit([encoder.finish()])
	}
}