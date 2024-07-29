import { render_pass, setup } from "../../util/helpers"
import compute from "./compute.wgsl?raw"
import shader from "./render.wgsl?raw"

const { canvas, context, device, format } = await setup()

const grid_size = 64

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

const module = device.createShaderModule({ code: shader })

const render_pipeline = device.createRenderPipeline({
	layout: device.createPipelineLayout({ bindGroupLayouts: [bind_group_layout] }),
	vertex: {
		module,
		buffers: [{
			arrayStride: 8,
			attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }]
		}]
	},
	fragment: { module, targets: [{ format }] }
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
	compute_pass.setPipeline(device.createComputePipeline({
		layout: device.createPipelineLayout({ bindGroupLayouts: [bind_group_layout] }),
		compute: { module: device.createShaderModule({ code: compute }) }
	}))
	compute_pass.setBindGroup(0, bind_groups[step % 2])
	compute_pass.dispatchWorkgroups(workgroup_count, workgroup_count)
	compute_pass.end()

	const pass = render_pass(encoder, context, [0, 0, 0, 1])
	pass.setPipeline(render_pipeline)
	pass.setBindGroup(0, bind_groups[step % 2])
	pass.setVertexBuffer(0, vertex_buffer)
	pass.draw(vertices.length / 2, grid_size ** 2)
	pass.end()

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

// canvas.addEventListener("mousedown", update); update(); update()