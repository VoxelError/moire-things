import "../styles.scss"
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
		arrayStride: 20,
		attributes: [
			{ shaderLocation: 0, offset: 0, format: 'float32x2' },
			{ shaderLocation: 4, offset: 8, format: 'float32x3' },
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
	const vertex_data = new Float32Array(vertices * 5)
	// const color_data = new Uint8Array(vertex_data.buffer)

	let offset = 0
	const add_vertex = (v, r, color) => {
		vertex_data[offset++] = cos(v * tau / sectors) * r
		vertex_data[offset++] = sin(v * tau / sectors) * r
		vertex_data[offset++] = color[0]
		vertex_data[offset++] = color[1]
		vertex_data[offset++] = color[2]
	}

	for (let i = 0; i < sectors; ++i) {
		const k = i + 1
		const inner = Array(3).fill(0.25)
		const outer = Array(3).fill(1)

		add_vertex(i, radius, outer)
		add_vertex(k, radius, outer)
		add_vertex(i, inner_radius, inner)

		add_vertex(i, inner_radius, inner)
		add_vertex(k, radius, outer)
		add_vertex(k, inner_radius, inner)
	}

	return { vertices, vertex_data }
}

const { vertices, vertex_data } = circle_vertices({ radius: 0.5, inner_radius: 0.3 })
const vertex_buffer = device.createBuffer({
	size: vertex_data.byteLength,
	usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
})
device.queue.writeBuffer(vertex_buffer, 0, vertex_data)

const generate_instances = (instances) => {
	const instance_values = new Float32Array(8 * instances)
	const vertex_props_buffer = device.createBuffer({
		size: 32 * instances,
		usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
	})

	for (let i = 0; i < instances; ++i) {
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
	render_pass.draw(vertices, instances)
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