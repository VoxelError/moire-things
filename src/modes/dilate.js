import { cursor } from "../util/controls.js"
import { get_storage, render_pass, set_storage, setup } from "../util/helpers.js"
import { abs, cos, cos_wave, pi, tau } from "../util/math.js"
import shader from "../shaders/dilate.wgsl?raw"

export default (props) => {
	const { canvas, context, device, queue, format, gui } = props

	const points = [
		{
			x: 0,
			y: 0,
			delta: 0,
		}
	]

	const settings = {
		clear: () => points.length = 0,
		undo: () => points.pop(),
		reset,
		teeth: false,
		speed: 1,
		sectus: 0.5,
		offset: 0.5,
		sectors: 8,
	}
	gui.remember(settings)

	function reset() {
		settings.speed = 0
		settings.sectus = 0.5
		settings.offset = 1
		settings.sectors = 5
		gui.updateDisplay()
	}

	gui.add(settings, "clear")
	gui.add(settings, "undo")
	gui.add(settings, "reset").name("reset values")
	gui.add(settings, "teeth")
	gui.add(settings, "speed", 0, 2, 0.01).name("time_multiplier")
	gui.add(settings, "sectus", 0, 0.99, 0.01)
	gui.add(settings, "offset", 0.5, 1.5, 0.05)
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
						dstFactor: 'zero',
					},
					alpha: {
						operation: 'add',
						srcFactor: 'one',
						dstFactor: 'one',
					},
				}
			}]
		},
		// primitive: { topology: "line-list" },
	})

	const render = (time) => {
		const vertices = settings.sectors * 6
		const index_data = new Uint32Array(vertices)
		const vertex_data = new Float32Array(vertices * 2)

		const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

		const aspect = canvas.height / canvas.width
		const speed = time * settings.speed

		const add_orb = () => points.push({
			x: cursor.x,
			y: cursor.y,
			delta: speed,
		})

		// cursor.left_held && add_orb()
		// cursor.right_click = add_orb

		for (let i = 0; i <= settings.sectors; i++) {
			const radius = 2.5
			const sectus = settings.sectus
			const apothem = radius * cos(pi / settings.sectors)
			const ratio = tau / settings.sectors;
			const delta = (offset) => (i + offset) * ratio + settings.speed * time * 0.002;

			vertex_data.set([
				delta(0),
				radius,
				delta(sectus / 2),
				// apothem * sectus,
				radius * sectus / 2,
			], i * 4)

			const teeth = settings.teeth ? [0, 1, 2] : [1, 2, 3]

			if (i < settings.sectors) index_data.set([0, 1, 2, ...teeth].map(e => e + i * 2), i * 6)
		}

		queue.writeBuffer(vertex_buffer, 0, vertex_data)
		queue.writeBuffer(index_buffer, 0, index_data)

		const instance_buffer = device.createBuffer({ size: props_stride * points.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
		const instance_values = new Float32Array(props_stride / 4 * points.length)

		points.forEach((orb, i) => {
			orb.color = cos_wave(speed - orb.delta, -0.5, 0.5, 0.0005)
			orb.scale = abs(cos_wave(speed - orb.delta, 0.2, 0, 0.0025))

			instance_values.set([
				[orb.x, orb.y],
				[orb.scale, aspect],
				[orb.delta * 0.005],
				[orb.color, 1, 0.5, 1],
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

		return requestAnimationFrame(render)
	}
	return render()
}