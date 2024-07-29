import { abs, cos, cos_wave, phi, pi, rng, sin, sin_wave, tau } from "../../util/math.js"
import { cursor, listen } from "../../util/controls.js"
import { hsl_to_rgb } from "../../util/helpers.js"
import { GUI } from "dat.gui"
import shader from "./shader.wgsl?raw"

const set_storage = (name, item) => localStorage.setItem(name, JSON.stringify(item))
const get_storage = (name, fallback) => JSON.parse(localStorage.getItem(name)) ?? fallback

const orb_list = get_storage("orb_list", [])

const settings = {
	clear: () => orb_list.length = 0,
	undo: () => orb_list.pop(),
	speed: 0,
	radius: 1.5,
	sectus: 0.5,
	sectors: 5,
}

const gui = new GUI({ closeOnTop: true })
gui.domElement.style.userSelect = "none"

gui.add(settings, "clear")
gui.add(settings, "undo")
gui.add(settings, "speed", 0, 2, 0.01)
gui.add(settings, "radius", 0.5, 1.5, 0.01)
gui.add(settings, "sectus", 0, 1, 0.01)
gui.add(settings, "sectors", 3, 17, 1)
// gui.add(settings, "hue_hz", 1, 5)

const canvas = document.createElement("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.append(canvas)
listen(canvas)

const adapter = await navigator.gpu?.requestAdapter()
const device = await adapter?.requestDevice()
const format = navigator.gpu.getPreferredCanvasFormat()

const context = canvas.getContext("webgpu")
context.configure({ device, format })

const pipeline = device.createRenderPipeline({
	layout: "auto",
	vertex: {
		module: device.createShaderModule({ code: shader }),
		buffers: [
			{ arrayStride: 8, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }] },
			{
				arrayStride: 40,
				stepMode: 'instance',
				attributes: [
					{ shaderLocation: 1, offset: 0, format: 'float32x4' },
					{ shaderLocation: 2, offset: 16, format: 'float32x2' },
					{ shaderLocation: 3, offset: 24, format: 'float32x2' },
					{ shaderLocation: 4, offset: 32, format: 'float32x2' },
				]
			},
			{ arrayStride: 4, attributes: [{ shaderLocation: 5, offset: 0, format: 'unorm8x4' }] },
		],
	},
	fragment: {
		module: device.createShaderModule({ code: shader }),
		targets: [{ format }]
	},
	// primitive: { topology: "line-list" },
})

!function render(time) {
	const circle_vertices = ({ speed, sectors, radius, sectus }) => {
		const apothem = radius * cos(pi / sectors)

		sectors > 16 && (sectors = 33)
		sectus = Math.min(sectus, 0.98)
		speed *= time

		const vertices = sectors * 6
		const index_data = new Uint32Array(vertices)
		const vertex_data = new Float32Array(vertices * 2)
		const color_data = new Uint8Array(vertices * 4)

		for (let i = 0; i <= sectors; i++) {
			vertex_data.set([
				cos_wave(i * tau / sectors, radius, 0, 1, -speed * 0.002),
				sin_wave(i * tau / sectors, radius, 0, 1, -speed * 0.002),
				cos_wave((i + sectus) * tau / sectors, apothem * 0.5, 0, 1, -speed * 0.002),
				sin_wave((i + sectus) * tau / sectors, apothem * 0.5, 0, 1, -speed * 0.002),
			], i * 4)

			color_data.set([
				0.1, 0.1, 0.1, null,
				1.0, 1.0, 1.0, null,
			], i * 8)

			// if (i < sectors) index_data.set([0, 1, 2, 1, 2, 3].map(e => e + i * 2), i * 6)
			if (i < sectors) index_data.set([0, 1, 2, 0, 1, 2].map(e => e + i * 2), i * 6)
		}

		return {
			vertices,
			index_data,
			vertex_data,
			color_data,
		}
	}
	const { vertices, index_data, vertex_data, color_data, } = circle_vertices(settings)

	const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const vertex_color_buffer = device.createBuffer({ size: color_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

	device.queue.writeBuffer(vertex_buffer, 0, vertex_data)
	device.queue.writeBuffer(vertex_color_buffer, 0, color_data)
	device.queue.writeBuffer(index_buffer, 0, index_data)

	const aspect = canvas.height / canvas.width
	const speed = time * settings.speed

	cursor.left_held && orb_list.push({
		x: (cursor.x / canvas.width) * 2 - 1,
		y: -((cursor.y / canvas.height) * 2 - 1),
		delta: speed,
	})
	set_storage("orb_list", orb_list)

	const vertex_props_buffer = device.createBuffer({ size: 40 * orb_list.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const instance_values = new Float32Array(10 * orb_list.length)

	orb_list.forEach((orb, i) => {
		orb.color = [
			...hsl_to_rgb(
				cos_wave(speed - orb.delta, -0.5, 0.5, 0.0005),
				1,
				0.5,
			),
			1,
		]
		orb.offset = [
			rng(1.6, -0.8),
			rng(1.6, -0.8),
		]
		orb.scale = abs(cos_wave(speed - orb.delta, 0.2, 0, 0.0025, pi))
		orb.shades = [
			[0.1, 0.1, 0.1],
			[1, 1, 1],
		]
		// orb.angle = 0

		instance_values.set([
			...orb.color,
			orb.x, orb.y,
			orb.scale * aspect, orb.scale,
			...orb.shades,
		], i * 10)
	})

	device.queue.writeBuffer(vertex_props_buffer, 0, instance_values)

	const encoder = device.createCommandEncoder()

	const render_pass = encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			clearValue: [0.2, 0.2, 0.2, 1.0],
			loadOp: "clear",
			storeOp: "store",
		}]
	})
	render_pass.setPipeline(pipeline)
	render_pass.setVertexBuffer(0, vertex_buffer)
	render_pass.setVertexBuffer(1, vertex_props_buffer)
	render_pass.setVertexBuffer(2, vertex_color_buffer)
	render_pass.setIndexBuffer(index_buffer, 'uint32')
	render_pass.drawIndexed(vertices, orb_list.length)
	render_pass.end()

	device.queue.submit([encoder.finish()])

	requestAnimationFrame(render)
}()