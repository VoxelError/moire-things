import { setup } from "../util/helpers"

const { device } = await setup(false)

const module = device.createShaderModule({
	code: /* wgsl */`
		@group(0) @binding(0) var<storage, read_write> data: array<f32>;

		@compute
		@workgroup_size(1)
		fn compute_main(@builtin(global_invocation_id) id: vec3u) {
			let i = id.x;
			data[i] = data[i] * 2;
		}
    `,
})

const input = new Float32Array([1, 3, 5])
const workBuffer = device.createBuffer({
	size: input.byteLength,
	usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
})
device.queue.writeBuffer(workBuffer, 0, input)

const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module } })

const bindGroup = device.createBindGroup({
	layout: pipeline.getBindGroupLayout(0),
	entries: [
		{ binding: 0, resource: { buffer: workBuffer } },
	]
})

const encoder = device.createCommandEncoder()

const pass = encoder.beginComputePass()
pass.setPipeline(pipeline)
pass.setBindGroup(0, bindGroup)
pass.dispatchWorkgroups(input.length)
pass.end()

const resultBuffer = device.createBuffer({
	size: input.byteLength,
	usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
})
encoder.copyBufferToBuffer(workBuffer, 0, resultBuffer, 0, resultBuffer.size)

device.queue.submit([encoder.finish()])

await resultBuffer.mapAsync(GPUMapMode.READ)
const result = new Float32Array(resultBuffer.getMappedRange())

console.log(String(input))
console.log(String(result))

resultBuffer.unmap()