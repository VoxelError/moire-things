import "../styles.scss"
import { rng } from "../util/math.js"
import shader from "../shaders/instances2.wgsl?raw"
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

const module = device.createShaderModule({ code: shader })
const pipeline = device.createRenderPipeline({
	layout: "auto",
	vertex: { module },
	fragment: { module, targets: [{ format }] }
})

const max = 100
const instances = []

const generate_instances = () => {
	instances.length = 0

	for (let i = 0; i < max; ++i) {
		const storage_buffer = device.createBuffer({
			size: 32,
			usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
		})

		const instance_values = new Float32Array(8)

		const bind_group = device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: [{ binding: 0, resource: { buffer: storage_buffer } }],
		})

		instances.push({
			storage_buffer,
			instance_values,
			bind_group,
		})
	}
}

const update = () => {
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

	generate_instances()
	const aspect = canvas.width / canvas.height
	for (const instance of instances) {
		const { storage_buffer, instance_values, bind_group } = instance

		const offset = {
			x: (2 * cursor.x / canvas.width - 1) + rng(0.4, -0.2),
			y: (-2 * cursor.y / canvas.height + 1) + rng(0.4, -0.2) * 1.8,
		}
		const scale = rng(0.01, 0.01)
		instance_values.set([rng(), rng(), rng(), 1], 0)
		instance_values.set([offset.x, offset.y], 4)
		instance_values.set([scale / aspect, scale], 6)
		device.queue.writeBuffer(storage_buffer, 0, instance_values)

		render_pass.setBindGroup(0, bind_group)
		render_pass.draw(6)
	}

	// render_pass.setVertexBuffer(0, device.createBuffer({ size: 24, usage: GPUBufferUsage.VERTEX }))
	render_pass.end()

	device.queue.submit([encoder.finish()])
}

update()
document.addEventListener("mousedown", () => update())