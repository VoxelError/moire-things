import { abs, cos, cos_wave, phi, pi, rng, sin, sin_wave, tau } from "../../util/math.js"
import { cursor, listen } from "../../util/controls.js"
import { hsl_to_rgb } from "../../util/helpers.js"
import { GUI } from "dat.gui"
import shader from "./shader.wgsl?raw"

const set_storage = (name, item) => localStorage.setItem(name, JSON.stringify(item))
const get_storage = (name, fallback) => JSON.parse(localStorage.getItem(name)) ?? fallback

const orb_list = get_storage("orb_list", [])

const settings = {
	reset: () => orb_list.length = 0,
	edges: 8,
}
const gui = new GUI({ closeOnTop: true })
gui.add(settings, "reset")
gui.add(settings, "edges", 3, 16, 1)

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
				arrayStride: 32,
				stepMode: 'instance',
				attributes: [
					{ shaderLocation: 1, offset: 0, format: 'float32x4' },
					{ shaderLocation: 2, offset: 16, format: 'float32x2' },
					{ shaderLocation: 3, offset: 24, format: 'float32x2' },
				]
			},
			{ arrayStride: 4, attributes: [{ shaderLocation: 4, offset: 0, format: 'unorm8x4' }] },
		],
	},
	fragment: {
		module: device.createShaderModule({ code: shader }),
		targets: [{ format }]
	},
	// primitive: { topology: "line-list" },
})

!function render(time) {
	const circle_vertices = ({ time = 0, sectors = 3, radius, inner_radius = 0 }) => {
		const vertices = sectors * 6
		const index_data = new Uint32Array(vertices)
		const vertex_data = new Float32Array(vertices * 2)
		const color_data = new Uint8Array(vertices * 4)

		let offset = 0
		const ratio = tau / sectors

		const add_vertices = (v, r, color) => {
			vertex_data.set([
				cos_wave(v * ratio, r, 0, 1, time * 0.002),
				sin_wave(v * ratio, r, 0, 1, time * 0.002),
			], offset * 2)
			color_data.set([
				color[0] * 255,
				color[1] * 255,
				color[2] * 255,
			], offset * 4)

			offset++
		}

		for (let i = 0; i <= sectors; i++) {
			add_vertices(i, radius, [0.1, 0.1, 0.1])
			add_vertices(i, inner_radius, [1, 1, 1])

			if (i !== sectors) index_data.set([0, 1, 2, 2, 1, 3].map(e => e + i * 2), i * 6)
		}

		return {
			vertices,
			index_data,
			vertex_data,
			color_data,
		}
	}
	const { vertices, index_data, vertex_data, color_data, } = circle_vertices({ time, sectors: settings.edges, radius: 0.5, inner_radius: 0.48 })

	const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const vertex_color_buffer = device.createBuffer({ size: color_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

	device.queue.writeBuffer(vertex_buffer, 0, vertex_data)
	device.queue.writeBuffer(vertex_color_buffer, 0, color_data)
	device.queue.writeBuffer(index_buffer, 0, index_data)

	cursor.held && orb_list.push({
		x: (cursor.x / canvas.width) * 2 - 1,
		y: -((cursor.y / canvas.height) * 2 - 1),
		delta: time,
	})
	set_storage("orb_list", orb_list)

	const vertex_props_buffer = device.createBuffer({ size: 32 * orb_list.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const instance_values = new Float32Array(8 * orb_list.length)

	orb_list.forEach((orb, i) => {
		orb.color = [
			...hsl_to_rgb(
				cos_wave(time - orb.delta, -0.5, 0.5, 0.0005),
				1,
				0.5,
			),
			1,
		]
		orb.offset = [
			rng(1.6, -0.8),
			rng(1.6, -0.8),
		]
		orb.scale = abs(sin_wave(time - orb.delta, 0.3, 0, 0.0025))
		// orb.angle = 0

		const scales = [
			orb.scale * (canvas.height / canvas.width),
			orb.scale,
		]

		instance_values.set([
			// ...orb.color,
			0.5, 0.5, 0.5, 1,
			orb.x, orb.y,
			...scales
		], i * 8)
	})

	device.queue.writeBuffer(vertex_props_buffer, 0, instance_values)

	const encoder = device.createCommandEncoder()

	const render_pass = encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			clearValue: [0, 0, 0, 1],
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