import { cursor } from "../../util/controls.js"
import { render_pass, setup } from "../../util/helpers.js"
import { abs, cos, cos_wave, phi, pi, rng, sin, sin_wave, tau } from "../../util/math.js"
import { GUI } from "dat.gui"
import shader from "./shader.wgsl?raw"

const { canvas, context, device, format } = await setup()

const set_storage = (name: string, item: any) => localStorage.setItem(name, JSON.stringify(item))
const get_storage = (name: string, fallback: any) => {
	const check = localStorage.getItem(name)
	return check ? JSON.parse(check) : fallback
}

const orb_list = get_storage("orb_list", [])

const gui = new GUI({ closeOnTop: true })
gui.domElement.style.userSelect = "none"

const settings = {
	clear: () => orb_list.length = 0,
	undo: () => orb_list.pop(),
	reset,
	...get_storage("settings", {
		speed: 1,
		radius: 1,
		sectus: 0.5,
		sectors: 8,
	})
}

function reset() {
	settings.speed = 1
	settings.radius = 1
	settings.sectus = 0.5
	settings.sectors = 8
	gui.updateDisplay()
}

gui.add(settings, "clear").name("clear_board")
gui.add(settings, "reset").name("reset_gui")
gui.add(settings, "undo").name("undo_plot")
gui.add(settings, "speed", 0, 2, 0.01).name("time_multiplier")
gui.add(settings, "radius", 0.5, 1.5, 0.01)
gui.add(settings, "sectus", 0, 0.99, 0.01)
gui.add(settings, "sectors", 3, 33, 1)
// gui.add(settings, "hue_hz", 1, 5)

const props_stride = 32

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
					{ shaderLocation: 4, offset: 20, format: 'float32x3' },
				]
			}
		]
	},
	fragment: {
		module: device.createShaderModule({ code: shader }),
		targets: [{ format }]
	},
	// primitive: { topology: "line-list" },
})

!function render(time: number): any {
	set_storage("settings", settings)

	const vertices = settings.sectors * 6
	const index_data = new Uint32Array(vertices)
	const vertex_data = new Float32Array(vertices * 2)

	for (let i = 0; i <= settings.sectors; i++) {
		const ratio = i * tau / settings.sectors;
		const delta = ratio + settings.speed * time * 0.002;

		vertex_data.set([delta, settings.radius, delta, settings.radius * settings.sectus], i * 4)

		if (i < settings.sectors) index_data.set([0, 1, 2, 1, 2, 3].map(e => e + i * 2), i * 6)
	}

	const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

	device.queue.writeBuffer(vertex_buffer, 0, vertex_data)
	device.queue.writeBuffer(index_buffer, 0, index_data)

	const aspect = canvas.height / canvas.width
	const speed = time * settings.speed

	cursor.left_held && orb_list.push({
		x: (cursor.x / canvas.width) * 2 - 1,
		y: -((cursor.y / canvas.height) * 2 - 1),
		delta: speed,
	})
	set_storage("orb_list", orb_list)

	const instance_buffer = device.createBuffer({ size: props_stride * orb_list.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const instance_values = new Float32Array(props_stride / 4 * orb_list.length)

	orb_list.forEach((orb: any, i: number) => {
		orb.color = cos_wave(speed - orb.delta, -0.5, 0.5, 0.0005)
		orb.scale = abs(cos_wave(speed - orb.delta, 0.2, 0, 0.0025))

		instance_values.set([
			[orb.x, orb.y],
			[orb.scale, aspect],
			[orb.delta * 0.005],
			[orb.color, 1, 0.5],
		].flat(), i * props_stride / 4)
	})

	device.queue.writeBuffer(instance_buffer, 0, instance_values)

	const encoder = device.createCommandEncoder()
	const pass: GPURenderPassEncoder = render_pass(encoder, context, [0.2, 0.2, 0.2, 1.0])

	pass.setPipeline(pipeline)
	pass.setVertexBuffer(0, vertex_buffer)
	pass.setVertexBuffer(1, instance_buffer)
	pass.setIndexBuffer(index_buffer, 'uint32')
	pass.drawIndexed(vertices, orb_list.length)
	pass.end()

	device.queue.submit([encoder.finish()])

	requestAnimationFrame(render)
}(0)