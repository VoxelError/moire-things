import { cursor } from "../util/controls.js"
import { render_pass } from "../util/helpers.js"
import { abs, cos_wave, tau } from "../util/math.js"
import shader from "../shaders/bubbles.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, gui } = props

	const points = []

	const settings = {
		clear: () => points.length = 0,
		undo: () => points.pop(),
		reset,
		colors: true,
		speed: 1,
		radius: 1,
		sectus: 0,
		sectors: 33,
	}
	gui.remember(settings)

	function reset() {
		settings.colors = true
		settings.speed = 1
		settings.radius = 1
		settings.sectus = 0
		settings.sectors = 33
		gui.updateDisplay()
	}

	gui.add(settings, "clear")
	gui.add(settings, "undo")
	gui.add(settings, "reset").name("reset values")
	gui.add(settings, "colors")
	gui.add(settings, "speed", 0, 2, 0.01)
	gui.add(settings, "radius", 0.5, 1.5, 0.01)
	gui.add(settings, "sectus", 0, 0.99, 0.01)
	gui.add(settings, "sectors", 3, 33, 1)
	// gui.add(settings, "hue_hz", 1, 5)

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
		const vertices = settings.sectors * 6
		const index_data = new Uint32Array(vertices)
		const vertex_data = new Float32Array(vertices * 2)

		const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

		const aspect = canvas.height / canvas.width
		const speed = time * settings.speed

		const add_point = () => points.push({
			x: (cursor.x / canvas.width) * 2 - 1,
			y: -((cursor.y / canvas.height) * 2 - 1),
			delta: speed,
		})

		cursor.left_held && add_point()
		cursor.right_click = add_point

		for (let i = 0; i <= settings.sectors; i++) {
			const ratio = i * tau / settings.sectors;
			const delta = ratio + settings.speed * time * 0.002;

			vertex_data.set([delta, settings.radius, delta, settings.radius * settings.sectus], i * 4)

			if (i < settings.sectors) index_data.set([0, 1, 2, 1, 2, 3].map(e => e + i * 2), i * 6)
		}

		queue.writeBuffer(vertex_buffer, 0, vertex_data)
		queue.writeBuffer(index_buffer, 0, index_data)

		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		points.forEach((bubble, i) => {
			const saturation = settings.colors ? 1 : 0

			bubble.color = cos_wave(speed - bubble.delta, -0.5, 0.5, 0.0005)
			bubble.scale = abs(cos_wave(speed - bubble.delta, 0.2, 0, 0.0025))

			instance_values.set([
				[bubble.x, bubble.y],
				[bubble.scale, aspect],
				[bubble.delta * 0.005],
				[bubble.color, saturation, 0.5, 0.5],
			].flat(), i * props_stride / 4)
		})

		queue.writeBuffer(instance_buffer, 0, instance_values)

		const encoder = device.createCommandEncoder()
		const pass = render_pass(encoder, context, [0.2, 0.2, 0.2, 1])

		pass.setPipeline(pipeline)
		pass.setVertexBuffer(0, vertex_buffer)
		pass.setVertexBuffer(1, instance_buffer)
		pass.setIndexBuffer(index_buffer, 'uint32')
		pass.drawIndexed(vertices, points.length)
		pass.end()

		queue.submit([encoder.finish()])
	}
}