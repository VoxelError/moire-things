import compute from "./compute.wgsl?raw"
import shader from "./render.wgsl?raw"

// SETUP

const grid_size = 64

const canvas = document.createElement("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.append(canvas)

const adapter = await navigator.gpu.requestAdapter()
const device = await adapter.requestDevice()
const format = navigator.gpu.getPreferredCanvasFormat()

const context = canvas.getContext("webgpu")
context.configure({ device, format })

// PIPELINE

const create_entry = (binding, visibility, buffer) => ({ binding, visibility, buffer })

const ALL_STAGES = GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT
const { COMPUTE } = GPUShaderStage

const bind_group_layout = device.createBindGroupLayout({
	entries: [
		create_entry(0, ALL_STAGES, {}),
		create_entry(1, ALL_STAGES, { type: "read-only-storage" }),
		create_entry(2, COMPUTE, { type: "storage" }),
		create_entry(3, ALL_STAGES, { type: "read-only-storage" }),
		create_entry(4, COMPUTE, { type: "storage" })
	]
})

const compute_pipeline = device.createComputePipeline({
	layout: device.createPipelineLayout({ bindGroupLayouts: [bind_group_layout] }),
	compute: {
		module: device.createShaderModule({ code: compute }),
		entryPoint: "compute_main",
	}
})

const render_pipeline = device.createRenderPipeline({
	layout: device.createPipelineLayout({ bindGroupLayouts: [bind_group_layout] }),
	vertex: {
		module: device.createShaderModule({ code: shader }),
		entryPoint: "vertex_main",
		buffers: [{
			arrayStride: 8,
			attributes: [{
				format: "float32x2",
				offset: 0,
				shaderLocation: 0
			}]
		}]
	},
	fragment: {
		module: device.createShaderModule({ code: shader }),
		entryPoint: "fragment_main",
		targets: [{ format }]
	}
})

// BUFFERS

const create_buffer = (size, usage) => device.createBuffer({ size, usage })
const create_storage = (array) => ([
	create_buffer(array.byteLength, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
	create_buffer(array.byteLength, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
])

const triangle = [-1, -1, 1, 1, -1, 1]
const vertices = new Float32Array(triangle.concat(triangle.map(e => -e)))
const vertex_buffer = create_buffer(48, GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST)
device.queue.writeBuffer(vertex_buffer, 0, vertices)

const uniform_buffer = create_buffer(8, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST)
device.queue.writeBuffer(uniform_buffer, 0, new Float32Array([grid_size, grid_size]))

const cell_state_array = new Uint32Array(grid_size ** 2).map(e => e = Math.random() > 0.55 ? 1 : 0)
const cell_state_storage = create_storage(cell_state_array)
device.queue.writeBuffer(cell_state_storage[0], 0, cell_state_array)

const cell_neighbor_array = new Uint32Array(grid_size ** 2)
const cell_neighbor_storage = create_storage(cell_neighbor_array)
device.queue.writeBuffer(cell_neighbor_storage[0], 0, cell_neighbor_array)

const bind_groups = [
	device.createBindGroup({
		layout: bind_group_layout,
		entries: [
			{ binding: 0, resource: { buffer: uniform_buffer } },
			{ binding: 1, resource: { buffer: cell_state_storage[0] } },
			{ binding: 2, resource: { buffer: cell_state_storage[1] } },
			{ binding: 3, resource: { buffer: cell_neighbor_storage[0] } },
			{ binding: 4, resource: { buffer: cell_neighbor_storage[1] } },
		]
	}),
	device.createBindGroup({
		layout: bind_group_layout,
		entries: [
			{ binding: 0, resource: { buffer: uniform_buffer } },
			{ binding: 1, resource: { buffer: cell_state_storage[1] } },
			{ binding: 2, resource: { buffer: cell_state_storage[0] } },
			{ binding: 3, resource: { buffer: cell_neighbor_storage[1] } },
			{ binding: 4, resource: { buffer: cell_neighbor_storage[0] } },
		]
	})
]

// RENDER

let step = 0
const workgroup_count = Math.ceil(grid_size / 8)

const update = () => {
	const encoder = device.createCommandEncoder()

	const compute_pass = encoder.beginComputePass()
	compute_pass.setPipeline(compute_pipeline)
	compute_pass.setBindGroup(0, bind_groups[step % 2])
	compute_pass.dispatchWorkgroups(workgroup_count, workgroup_count)
	compute_pass.end()

	const colorAttachments = [{
		view: context.getCurrentTexture().createView(),
		loadOp: "clear",
		clearValue: [0, 0, 0, 1],
		storeOp: "store",
	}]

	const render_pass = encoder.beginRenderPass({ colorAttachments })
	render_pass.setPipeline(render_pipeline)
	render_pass.setBindGroup(0, bind_groups[step % 2])
	render_pass.setVertexBuffer(0, vertex_buffer)
	render_pass.draw(vertices.length / 2, grid_size ** 2)
	render_pass.end()

	device.queue.submit([encoder.finish()])
	step++
}

let counter = 0
!function render() {
	const delay = 1
	counter++
	counter % (delay + 1) == 0 && update()
	requestAnimationFrame(render)
}()

// document.addEventListener("mousedown", update); update(); update()