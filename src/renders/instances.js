import { cos, rng, sin, tau } from "../util/math.js"
import shader from "../shaders/instances.wgsl?raw"
import { cursor, listen } from "../util/controls.js"

const canvas = document.createElement("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.append(canvas)
listen(canvas)
const aspect = canvas.width / canvas.height

const adapter = await navigator.gpu?.requestAdapter()
const device = await adapter?.requestDevice()
const format = navigator.gpu.getPreferredCanvasFormat()

const context = canvas.getContext("webgpu")
context.configure({ device, format })

const buffers = [
	{
		arrayStride: 8,
		attributes: [
			{ shaderLocation: 0, offset: 0, format: 'float32x2' },
		]
	},
	{
		arrayStride: 32,
		stepMode: 'instance',
		attributes: [
			{ shaderLocation: 1, offset: 0, format: 'float32x4' },
			{ shaderLocation: 2, offset: 16, format: 'float32x2' },
			{ shaderLocation: 3, offset: 24, format: 'float32x2' },
		],
	},
	{
		arrayStride: 4,
		attributes: [
			{ shaderLocation: 4, offset: 0, format: 'unorm8x4' },
		]
	},
]

const module = device.createShaderModule({ code: shader })
const pipeline = device.createRenderPipeline({
	layout: "auto",
	vertex: {
		module,
		buffers
	},
	fragment: { module, targets: [{ format }] },
	// primitive: { topology: "line-list" },
})

function circle_vertices({ radius = 1, inner_radius = 0, sectors = 24 }) {
	const vertices = sectors * 6
	const index_data = new Uint32Array(sectors * 6)
	const vertex_data = new Float32Array(vertices * 2)
	const color_data = new Uint8Array(vertices * 4)

	let offset = 0
	const add_vertex = (v, r, color) => {
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
		const inner = Array(3).fill(0.25)
		const outer = Array(3).fill(1)

		add_vertex(i, radius, inner)
		add_vertex(i, inner_radius, outer)
	}

	for (let i = 0; i < sectors; i++) {
		const indices = [0, 1, 2, 2, 1, 3]
		index_data.set(indices.map(e => e + i * 2), i * 6)
	}

	return {
		vertices,
		index_data,
		vertex_data,
		color_data,
	}
}

const { vertices, index_data, vertex_data, color_data } = circle_vertices({ radius: 0.5, inner_radius: 0.3, sectors: 5 })

const vertex_buffer = device.createBuffer({
	size: vertex_data.byteLength,
	usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
})
device.queue.writeBuffer(vertex_buffer, 0, vertex_data)

const vertex_color_buffer = device.createBuffer({
	size: color_data.byteLength,
	usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
})
device.queue.writeBuffer(vertex_color_buffer, 0, color_data)

const index_buffer = device.createBuffer({
	size: index_data.byteLength,
	usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
})
device.queue.writeBuffer(index_buffer, 0, index_data)

const generate_instances = (instances) => {
	const instance_values = new Float32Array(8 * instances)
	const vertex_props_buffer = device.createBuffer({
		size: 32 * instances,
		usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
	})

	for (let i = 0; i < instances; i++) {
		const scale = rng(0.15, 0.15)
		const offset = {
			x: rng(1.6, -0.8),
			y: rng(1.6, -0.8),
		}

		instance_values.set([rng(), rng(), rng(), 1], 0 + 8 * i)
		instance_values.set([offset.x, offset.y], 4 + 8 * i)
		instance_values.set([scale / aspect, scale], 6 + 8 * i)
	}

	device.queue.writeBuffer(vertex_props_buffer, 0, instance_values)

	return vertex_props_buffer
}

const update = () => {
	const instances = 100
	const vertex_props_buffer = generate_instances(instances)

	const encoder = device.createCommandEncoder()

	const render_pass = encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			clearValue: [0.2, 0.2, 0.2, 1],
			loadOp: "clear",
			storeOp: "store",
		}]
	})
	render_pass.setPipeline(pipeline)
	render_pass.setVertexBuffer(0, vertex_buffer)
	render_pass.setVertexBuffer(1, vertex_props_buffer)
	render_pass.setVertexBuffer(2, vertex_color_buffer)
	render_pass.setIndexBuffer(index_buffer, 'uint32')
	render_pass.drawIndexed(vertices, instances)
	render_pass.end()

	device.queue.submit([encoder.finish()])
}

let count = 0

!function render() {
	const delay = 100

	count++
	count == 1 && update()
	cursor.held && cursor.button == "right" && update()
	setTimeout(() => requestAnimationFrame(render), delay)
}()

cursor.click = update