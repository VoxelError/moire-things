import { sin_wave } from "../util/math"
import shader from "../shaders/textures.wgsl?raw"
import { GUI } from "dat.gui"
import { gen_mips } from "./mip"
import { render_pass, setup } from "../util/helpers"

const { canvas, context, device, format } = await setup()

canvas.width = window.innerWidth / 64
canvas.height = window.innerHeight / 64
canvas.style.imageRendering = "pixelated"

const settings = {
	addressModeU: 'clamp-to-edge',
	addressModeV: 'clamp-to-edge',
	magFilter: 'linear',
	minFilter: 'linear',
	scale: 6,
}

const gui = new GUI({ closeOnTop: true })
gui.add(settings, 'addressModeU', ['repeat', 'clamp-to-edge'])
gui.add(settings, 'addressModeV', ['repeat', 'clamp-to-edge'])
gui.add(settings, 'magFilter', ['nearest', 'linear'])
gui.add(settings, 'minFilter', ['nearest', 'linear'])
gui.add(settings, 'scale', 0.5, 6)

const tex_width = 8
const g = [0, 255, 0, 255]
const x = [0, 0, 0, 255]
const creeper = new Uint8Array([
	g, g, g, g, g, g, g, g,
	g, x, x, g, g, x, x, g,
	g, x, x, g, g, x, x, g,
	g, g, g, x, x, g, g, g,
	g, g, x, x, x, x, g, g,
	g, g, x, x, x, x, g, g,
	g, g, x, g, g, x, g, g,
	g, g, g, g, g, g, g, g,
].flat())

const mips = gen_mips(creeper, tex_width)

const texture = device.createTexture({
	size: [mips[0].width, mips[0].height],
	mipLevelCount: mips.length,
	format: 'rgba8unorm',
	usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
})
mips.forEach(({ data, width, height }, mipLevel) => {
	device.queue.writeTexture(
		{ texture, mipLevel },
		data,
		{ bytesPerRow: width * 4 },
		{ width, height }
	)
})

const module = device.createShaderModule({ code: shader })

const pipeline = device.createRenderPipeline({
	layout: 'auto',
	vertex: { module },
	fragment: {
		module, targets: [{ format }]
	}
})

const uniform_values = new Float32Array(4)
const uniform_buffer = device.createBuffer({
	size: 16,
	usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
})

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

!function render(time) {
	const theta = sin_wave(time, 0.15, -0.34, 0.0005)

	uniform_values.set([4 / canvas.width * settings.scale, 4 / canvas.height * settings.scale])
	uniform_values.set([theta, -1], 2)

	device.queue.writeBuffer(uniform_buffer, 0, uniform_values)

	const bind_group = bind_groups[(
		(settings.addressModeU === 'repeat' ? 1 : 0) +
		(settings.addressModeV === 'repeat' ? 2 : 0) +
		(settings.magFilter === 'linear' ? 4 : 0) +
		(settings.minFilter === 'linear' ? 8 : 0)
	)]

	const encoder = device.createCommandEncoder()
	const pass = render_pass(encoder, context, [0.2, 0.2, 0.2, 1])

	pass.setPipeline(pipeline)
	pass.setBindGroup(0, bind_group)
	pass.draw(6)
	pass.end()

	device.queue.submit([encoder.finish()])

	requestAnimationFrame(render)
}()