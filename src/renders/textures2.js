import shader from "../shaders/textures.wgsl?raw"
import { GUI } from "dat.gui"
import image from "../resources/images/f-texture.png"

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

async function load_image_bitmap(url) {
	const result = await fetch(url)
	const blob = await result.blob()
	return await createImageBitmap(blob, { colorSpaceConversion: 'none' })
}

const num_mip_levels = (...sizes) => {
	const max_size = Math.max(...sizes)
	return 1 + Math.log2(max_size) | 0
}

const url = image
const source = await load_image_bitmap(url)
const texture = device.createTexture({
	label: url,
	format: 'rgba8unorm',
	mipLevelCount: num_mip_levels(source.width, source.height),
	size: [source.width, source.height],
	usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
})
device.queue.copyExternalImageToTexture(
	{ source },
	{ texture },
	{ width: source.width, height: source.height },
)

const module = device.createShaderModule({ code: shader })

const pipeline = device.createRenderPipeline({
	layout: 'auto',
	vertex: { module },
	fragment: {
		module, targets: [{ format }]
	}
})

const uniform_values = new Float32Array(4)
const uniform_buffer = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST })

const settings = {
	addressModeU: 'clamp-to-edge',
	addressModeV: 'clamp-to-edge',
	magFilter: 'linear',
	minFilter: 'linear',
	scale: 100,
}

const gui = new GUI({ closeOnTop: true })
gui.add(settings, 'addressModeU', ['repeat', 'clamp-to-edge'])
gui.add(settings, 'addressModeV', ['repeat', 'clamp-to-edge'])
gui.add(settings, 'magFilter', ['nearest', 'linear'])
gui.add(settings, 'minFilter', ['nearest', 'linear'])
gui.add(settings, 'scale', 1, 500)

const bind_groups = []

for (let i = 0; i < 16; ++i) {
	const sampler = device.createSampler({
		addressModeU: (i & 1) ? 'repeat' : 'clamp-to-edge',
		addressModeV: (i & 2) ? 'repeat' : 'clamp-to-edge',
		magFilter: (i & 4) ? 'linear' : 'nearest',
		minFilter: (i & 8) ? 'linear' : 'nearest',
	})

	const bind_group = device.createBindGroup({
		layout: pipeline.getBindGroupLayout(0),
		entries: [
			{ binding: 0, resource: sampler },
			{ binding: 1, resource: texture.createView() },
			{ binding: 2, resource: { buffer: uniform_buffer } },
		]
	})

	bind_groups.push(bind_group)
}

function update() {
	uniform_values.set([4 / canvas.width * settings.scale, 4 / canvas.height * settings.scale])
	uniform_values.set([0, 0], 2)
	device.queue.writeBuffer(uniform_buffer, 0, uniform_values)

	const bind_group = bind_groups[(
		(settings.addressModeU === 'repeat' ? 1 : 0) +
		(settings.addressModeV === 'repeat' ? 2 : 0) +
		(settings.magFilter === 'linear' ? 4 : 0) +
		(settings.minFilter === 'linear' ? 8 : 0)
	)]

	const encoder = device.createCommandEncoder()

	const pass = encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			clearValue: [0.2, 0.2, 0.2, 1],
			loadOp: "clear",
			storeOp: "store",
		}]
	})
	pass.setPipeline(pipeline)
	pass.setBindGroup(0, bind_group)
	pass.draw(6)
	pass.end()

	device.queue.submit([encoder.finish()])
}

!function render() {
	update()
	requestAnimationFrame(render)
}()