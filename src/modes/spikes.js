import { cursor } from "../util/controls.js"
import { render_pass } from "../util/helpers.js"
import shader from "../shaders/spikes.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, points, gui } = props

	const aspect = canvas.height / canvas.width

	const settings = {
		clear: () => points.length = 0
	}
	gui.add(settings, "clear")

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

	const cursor_array = new Float32Array(2)
	const cursor_buffer = device.createBuffer({
		size: cursor_array.byteLength,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	})

	const aspect_buffer = device.createBuffer({
		size: 4,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	})
	device.queue.writeBuffer(aspect_buffer, 0, new Float32Array([aspect]))

	const bind_group = device.createBindGroup({
		layout: pipeline.getBindGroupLayout(0),
		entries: [
			{ binding: 0, resource: { buffer: cursor_buffer } },
			{ binding: 1, resource: { buffer: aspect_buffer } },
		]
	})

	const add_point = (time) => {
		points.push({
			x: cursor.x,
			y: cursor.y,
			delta: time,
		})
	}

	return (time) => {
		cursor_array.set([cursor.x, cursor.y])
		device.queue.writeBuffer(cursor_buffer, 0, cursor_array)

		cursor.left_held && add_point(time)
		cursor.right_click = () => add_point(time)

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
		pass.draw(6, points.length)
		pass.end()

		queue.submit([encoder.finish()])
	}
}