import { create_buffer, create_pipeline, render_pass, write_buffer } from "../util/helpers.js"
import { cursor } from "../util/controls.js"
import shader from "../shaders/bezier.wgsl?raw"

export default (props) => {
	const { canvas, context, device, format, gui } = props

	gui.hide()

	const blend = {
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
	const pipeline = create_pipeline(props, shader, [], [{ format, blend }], { width: canvas.width, height: canvas.height, })

	const usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST

	const mouse = create_buffer(props, usage, new Float32Array(2))
	const aspect = create_buffer(props, usage, new Float32Array([canvas.height / canvas.width]))
	const clock = create_buffer(props, usage, new Float32Array(1))

	write_buffer(props, aspect)

	const bind_group = device.createBindGroup({
		layout: pipeline.getBindGroupLayout(0),
		entries: [
			{ binding: 0, resource: { buffer: mouse.buffer } },
			{ binding: 1, resource: { buffer: aspect.buffer } },
			{ binding: 2, resource: { buffer: clock.buffer } },
		]
	})

	return (time) => {
		mouse.data.set([cursor.x, cursor.y])
		write_buffer(props, mouse)

		clock.data.set([time])
		write_buffer(props, clock)

		const encoder = device.createCommandEncoder()
		const pass = render_pass(encoder, context, [0, 0, 0, 1])

		pass.setPipeline(pipeline)
		pass.setBindGroup(0, bind_group)
		pass.draw(6)
		pass.end()

		device.queue.submit([encoder.finish()])
	}
}