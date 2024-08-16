import { cursor } from "../util/controls.js"
import { render_pass } from "../util/helpers.js"
import { abs, cos, phi, rng, sign, sin, tau } from "../util/math.js"
import shader from "../shaders/starfield.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, gui } = props

	const settings = { speed: 1 }
	gui.add(settings, "speed", 1, 2, 0.01)
	gui.remember(settings)

	const props_stride = 16

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
					]
				}
			]
		},
		fragment: {
			module: device.createShaderModule({ code: shader }),
			targets: [{ format }],
		},
		// primitive: { topology: "line-list" },
	})

	const points = []

	for (let i = 0; i < 100; i++) {
		points.push({
			x: rng(2, -1),
			y: rng(2, -1),
		})
	}

	return (time) => {
		const vertices = 6
		const index_data = new Uint32Array(vertices)
		const vertex_data = new Float32Array(vertices / 3 * 4)

		const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

		const aspect = canvas.height / canvas.width

		const add_point = () => points.push({
			x: (cursor.x / canvas.width) * 2 - 1,
			y: -((cursor.y / canvas.height) * 2 - 1),
		})

		cursor.left_held && add_point()
		cursor.right_click = add_point

		for (const star of points) {
			const radius = Math.hypot(star.x, star.y)
			const theta = Math.atan2(star.y, star.x)

			star.x += cos(theta) * radius * 0.005
			star.y += sin(theta) * radius * 0.005

			if (abs(star.x) > 1 || abs(star.y) > 1) {
				star.x = cos(theta) * 0.1
				star.y = sin(theta) * 0.1
			}
		}

		vertex_data.set([1, 1, 1, -1, -1, -1, -1, 1])
		index_data.set([0, 1, 2, 0, 3, 2])

		queue.writeBuffer(vertex_buffer, 0, vertex_data)
		queue.writeBuffer(index_buffer, 0, index_data)

		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		points.forEach((star, i) => {
			instance_values.set([
				[star.x, star.y],
				[0.001, aspect],
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