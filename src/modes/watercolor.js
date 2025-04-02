import { cursor } from "../util/controls.js"
import { render_pass } from "../util/helpers.js"
import { cos_wave, tau } from "../util/math.js"
import shader from "../shaders/watercolor.wgsl?raw"

// TODO: add hue setting

export default (props) => {
	const { canvas, context, device, queue, format, gui } = props

	const points = []

	const settings = {
		clear: () => points.length = 0,
		size: 1,
		alpha: 0.05,
	}

	gui.add(settings, "clear")
	gui.add(settings, "size", 0.5, 1.5, 0.05)
	gui.add(settings, "alpha", 0.05, 1, 0.05)

	const props_stride = 36

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
						{ shaderLocation: 3, offset: 16, format: 'float32' },
						{ shaderLocation: 4, offset: 20, format: 'float32x4' },
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

	return (time) => {
		const sectors = 64
		const vertices = sectors * 6
		const index_data = new Uint32Array(vertices)
		const vertex_data = new Float32Array(vertices * 2)

		const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

		const aspect = canvas.height / canvas.width

		const add_point = () => points.push({
			x: cursor.x,
			y: cursor.y,
			delta: time,
			size: settings.size,
			alpha: settings.alpha,
		})

		cursor.left_held && add_point()
		cursor.right_click = add_point

		for (let i = 0; i <= sectors; i++) {
			const ratio = i * tau / sectors
			vertex_data.set([ratio, 1, ratio, 0], i * 4)
		}

		for (let i = 0; i < sectors; i++) {
			index_data.set([0, 1, 2, 1, 2, 3].map(e => e + i * 2), i * 6)
		}

		queue.writeBuffer(vertex_buffer, 0, vertex_data)
		queue.writeBuffer(index_buffer, 0, index_data)

		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		points.forEach((bubble, i) => {
			const theta = time - bubble.delta
			const scale = Math.log(theta) * 0.025
			const size_cap = 0.2

			bubble.color = cos_wave(bubble.delta, -0.5, 0.5, 0.0005)
			// bubble.scale = theta < 1000 ? sin_wave(theta, 0.2, 0, 0.0025) : 0.25
			bubble.scale = scale < size_cap ? scale : size_cap

			instance_values.set([
				[bubble.x, bubble.y],
				[bubble.scale * bubble.size, aspect],
				[bubble.delta * 0.005],
				[bubble.color, 1, 0.5, bubble.alpha],
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