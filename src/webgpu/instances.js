import "../styles.scss"
import { rng } from "../util/math.js"
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

const module = device.createShaderModule({ code: shader })
const pipeline = device.createRenderPipeline({
	layout: "auto",
	vertex: { module },
	fragment: { module, targets: [{ format }] }
})

const generate_instances = (max) => {
	const instance_values = new Float32Array(8 * max)
	const storage_buffer = device.createBuffer({
		size: 32 * max,
		usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
	})

	for (let i = 0; i < max; ++i) {
		const scale = rng(0.01, 0.01)
		const offset = {
			x: (2 * cursor.x / canvas.width - 1) + rng(0.4, -0.2),
			y: (-2 * cursor.y / canvas.height + 1) + rng(0.4, -0.2) * 1.8,
		}

		instance_values.set([rng(), rng(), rng(), 1], 0 + 8 * i)
		instance_values.set([offset.x, offset.y], 4 + 8 * i)
		instance_values.set([scale / aspect, scale], 6 + 8 * i)
	}

	device.queue.writeBuffer(storage_buffer, 0, instance_values)

	return device.createBindGroup({
		layout: pipeline.getBindGroupLayout(0),
		entries: [{ binding: 0, resource: { buffer: storage_buffer } }],
	})
}

const update = () => {
	const max = 100
	const bind_group = generate_instances(max)

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
	render_pass.setBindGroup(0, bind_group)
	render_pass.draw(6, max)
	render_pass.end()

	device.queue.submit([encoder.finish()])
}

update()
document.addEventListener("mousedown", () => update())