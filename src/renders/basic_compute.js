import "../styles.scss"

const adapter = await navigator.gpu?.requestAdapter()
const device = await adapter?.requestDevice()
!device && alert("Your browser does not support WebGPU")

const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.append(canvas)

const context = canvas.getContext('webgpu')
const format = navigator.gpu.getPreferredCanvasFormat()
context.configure({ device, format })

const module = device.createShaderModule({
	code: /* wgsl */`
		@group(0) @binding(0) var<storage, read_write> data: array<f32>;

		@compute
		@workgroup_size(1)
		fn compute_main(@builtin(global_invocation_id) id: vec3u) {
			let i = id.x;
			data[i] = data[i] * 2.0;
		}
    `,
})

const pipeline = device.createComputePipeline({
	layout: 'auto',
	compute: { module },
})

const create_buffer = (array, flags) => (
	device.createBuffer({
		size: array.byteLength,
		usage: flags,
	})
)


const input = new Float32Array([1, 3, 5])
const workBuffer = create_buffer(input,
	GPUBufferUsage.STORAGE |
	GPUBufferUsage.COPY_SRC |
	GPUBufferUsage.COPY_DST
)
device.queue.writeBuffer(workBuffer, 0, input)

const resultBuffer = create_buffer(input,
	GPUBufferUsage.MAP_READ |
	GPUBufferUsage.COPY_DST
)

const bindGroup = device.createBindGroup({
	layout: pipeline.getBindGroupLayout(0),
	entries: [
		{ binding: 0, resource: { buffer: workBuffer } },
	]
})

!function render() {
	const encoder = device.createCommandEncoder()

	const pass = encoder.beginComputePass()
	pass.setPipeline(pipeline)
	pass.setBindGroup(0, bindGroup)
	pass.dispatchWorkgroups(input.length)
	pass.end()

	encoder.copyBufferToBuffer(workBuffer, 0, resultBuffer, 0, resultBuffer.size)

	device.queue.submit([encoder.finish()])
}()

await resultBuffer.mapAsync(GPUMapMode.READ)
const result = new Float32Array(resultBuffer.getMappedRange())

console.log(String(input))
console.log(String(result))

resultBuffer.unmap()