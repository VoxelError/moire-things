import { cos, cos_wave, phi, pi, rng, sin, sin_wave, tau } from "../util/math.js"
import shader from "../shaders/instances.wgsl?raw"
import { cursor, listen } from "../util/controls.js"

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

const buffers = [
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
]

const module = device.createShaderModule({ code: shader })
const pipeline = device.createRenderPipeline({
	layout: "auto",
	vertex: { module, buffers },
	fragment: { module, targets: [{ format }] },
	// primitive: { topology: "line-list" },
})

function circle_vertices({ sectors, radius, inner_radius = 0 }) {
	const vertices = sectors * 6
	const vertex_data = new Float32Array(vertices * 2)
	const color_data = new Uint8Array(vertices * 4)
	const index_data = new Uint32Array(sectors * 6)

	let offset = 0

	const add_vertices = (v, r, color) => {
		vertex_data.set([
			cos(v * tau / sectors) * r,
			sin(v * tau / sectors) * r,
		], offset * 2)
		color_data.set([
			color[0] * 255,
			color[1] * 255,
			color[2] * 255,
		], offset * 4)

		offset++
	}

	for (let i = 0; i <= sectors; i++) {
		const inner = [0.1, 0.1, 0.1]
		// const inner = [1, 1, 1]
		const outer = [1, 1, 1]

		add_vertices(i, radius, inner)
		add_vertices(i, inner_radius, outer)

		if (i == sectors) continue

		const indices = [0, 1, 2, 2, 1, 3]
		index_data.set(indices.map(e => e + i * 2), i * 6)
	}

	return {
		vertices,
		vertex_data,
		color_data,
		index_data,
	}
}

const { vertices, index_data, vertex_data, color_data } = circle_vertices({ sectors: 50, radius: 0.5, inner_radius: 0.48 })

const vertex_buffer = device.createBuffer({ size: vertex_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
const vertex_color_buffer = device.createBuffer({ size: color_data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
const index_buffer = device.createBuffer({ size: index_data.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST })

device.queue.writeBuffer(vertex_buffer, 0, vertex_data)
device.queue.writeBuffer(vertex_color_buffer, 0, color_data)
device.queue.writeBuffer(index_buffer, 0, index_data)

function rgb_to_hsl(r, g, b) {
	r /= 255, g /= 255, b /= 255

	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

	return [h, s, l];
}

class Orb {
	constructor(x, y, time = 0) {
		this.x = x
		this.y = y
		this.delta = time
		this.update(time)
	}

	update(time) {
		this.color = [
			cos_wave(time - this.delta, 0.5, 0, 0.001, 0),
			cos_wave(time - this.delta, 0.5, 0, 0.001, tau / 3),
			cos_wave(time - this.delta, 0.5, 0, 0.001, tau * 2 / 3),
			1,
		]
		this.offset = [
			rng(1.6, -0.8),
			rng(1.6, -0.8),
		]
		this.scale = cos_wave(time - this.delta, 0.35, 0, 0.0025, phi)
	}
}

const set_storage = (name, item) => localStorage.setItem(name, JSON.stringify(item))
const get_storage = (name, fallback) => JSON.parse(localStorage.getItem(name)) ?? fallback

// const orb_list = get_storage("orb_list", [])
const orb_list = []

const update = (time) => {
	cursor.held && orb_list.push(new Orb(
		(cursor.x / canvas.width) * 2 - 1,
		-((cursor.y / canvas.height) * 2 - 1),
		time
	))
	set_storage("orb_list", orb_list)

	const vertex_props_buffer = device.createBuffer({ size: 32 * orb_list.length, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST })
	const instance_values = new Float32Array(8 * orb_list.length)

	for (let i = 0; i < orb_list.length; i++) {
		const orb = orb_list[i]
		orb.update(time)

		const scales = [
			orb.scale * (canvas.height / canvas.width),
			orb.scale,
		]

		instance_values.set([
			...orb.color,
			// 0.5, 0.5, 0.5, 1,
			orb.x, orb.y,
			...scales
		], i * 8)
	}

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
}

!function render(time) {
	update(time)
	requestAnimationFrame(render)
}()