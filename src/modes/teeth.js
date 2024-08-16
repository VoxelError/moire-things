import { cursor } from "../util/controls.js"
import { render_pass } from "../util/helpers.js"
import { abs, cos, cos_wave, phi, pi, tau } from "../util/math.js"
import shader from "../shaders/teeth.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, gui } = props

	const points = []

	const settings = {
		clear: () => points.length = 0,
		undo: () => points.pop(),
		reset,
		radius: 1,
		teeth: 16,
	}
	gui.remember(settings)

	function reset() {
		settings.radius = 1
		settings.teeth = 16
		gui.updateDisplay()
	}

	gui.add(settings, "clear")
	gui.add(settings, "undo")
	gui.add(settings, "reset").name("reset values")
	gui.add(settings, "radius", 0.5, 1.5, 0.01)
	gui.add(settings, "teeth", 3, 16, 1)
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
						dstFactor: 'zero',
					},
					alpha: {
						operation: 'add',
						srcFactor: 'one',
						dstFactor: 'zero',
					},
				}
			}]
		},
		// primitive: { topology: "line-list" },
	})

	return (time) => {
		const vertices = settings.teeth * 6
		const index_data = new Uint32Array(vertices)
		const vertex_data = new Float32Array(vertices * 2)

		const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

		const aspect = canvas.height / canvas.width

		const add_orb = () => points.push({
			x: (cursor.x / canvas.width) * 2 - 1,
			y: -((cursor.y / canvas.height) * 2 - 1),
			delta: time,
		})

		cursor.left_held && add_orb()
		cursor.right_click = add_orb

		for (let i = 0; i <= settings.teeth; i++) {
			const radius = settings.radius
			const apothem = radius * cos(pi / settings.teeth)
			const ratio = tau / settings.teeth;
			const delta = (offset) => (i + offset) * ratio + time * 0.001;
			const chomp = abs(cos_wave(time, 0.5, 0, 0.0025))

			vertex_data.set([
				delta(0),
				radius,
				delta(0.5),
				apothem * chomp,
				// apothem * delta(0),
			], i * 4)

			if (i < settings.teeth) index_data.set([0, 1, 2, 0, 1, 2].map(e => e + i * 2), i * 6)
		}

		queue.writeBuffer(vertex_buffer, 0, vertex_data)
		queue.writeBuffer(index_buffer, 0, index_data)

		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		points.forEach((orb, i) => {
			orb.scale = cos_wave(time - orb.delta, 0.025, 0.2, 0.0025)
			orb.lightness = cos_wave(time - orb.delta, 0.15, 0.7, 0.0025)

			instance_values.set([
				[orb.x, orb.y],
				[orb.scale, aspect],
				[orb.delta * 0.0025],
				[0.7, 0.5, orb.lightness, 1],
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