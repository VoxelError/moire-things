import { mat4 } from 'https://webgpufundamentals.org/3rdparty/wgpu-matrix.module.js'
import shader from "../shaders/hall.wgsl?raw"
import { array_mipmap, canvas_mipmap, texture_mipmap, mipmapped_texture } from "./mip2"
import { degrees, tau } from "../util/math"
import image from "../f-texture.png"
import { GUI } from 'dat.gui'
import { setup } from '../util/helpers'

const { canvas, context, device, format } = await setup()

const module = device.createShaderModule({ code: shader })

const pipeline = device.createRenderPipeline({
	layout: 'auto',
	vertex: { module },
	fragment: { module, targets: [{ format }] },
})

const source = await createImageBitmap(
	await (await fetch(image)).blob(),
	{ colorSpaceConversion: 'none' },
)

const calc_mip_levels = (src) => 1 + Math.log2(Math.max(src.width, src.height)) | 0

const texture = device.createTexture({
	label: image,
	format: 'rgba8unorm',
	mipLevelCount: calc_mip_levels(source),
	size: [source.width, source.height],
	usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
})

device.queue.copyExternalImageToTexture(
	{ source },
	{ texture },
	{ width: source.width, height: source.height },
)

const textures = [
	// mipmapped_texture(texture_mipmap(source), device),
	mipmapped_texture(canvas_mipmap(), device),
	mipmapped_texture(array_mipmap(), device),
]

const objectInfos = []

const settings = {
	minFilter: false,
	mipmapFilter: true,
}

let tex_index = 0

const update = () => {
	objectInfos.length = 0

	for (let i = 0; i < 8; ++i) {
		const sampler = device.createSampler({
			addressModeU: 'repeat',
			addressModeV: 'repeat',
			minFilter: settings.minFilter ? 'linear' : 'nearest',
			mipmapFilter: settings.mipmapFilter ? 'linear' : 'nearest',
		})

		const uniformBuffer = device.createBuffer({
			label: 'uniforms for quad',
			size: 64,
			usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
		});

		const uniformValues = new Float32Array(16)
		const matrix = uniformValues.subarray(0, 16)

		const bindGroups = textures.map(texture =>
			device.createBindGroup({
				layout: pipeline.getBindGroupLayout(0),
				entries: [
					{ binding: 0, resource: sampler },
					{ binding: 1, resource: texture.createView() },
					{ binding: 2, resource: { buffer: uniformBuffer } },
				]
			})
		)

		objectInfos.push({
			bindGroups,
			matrix,
			uniformValues,
			uniformBuffer,
		})
	}

	const fov = degrees(70)
	const aspect = canvas.width / canvas.height
	const z_near = 1
	const z_far = 2000
	const projection_matrix = mat4.perspective(fov, aspect, z_near, z_far)

	const camera_pos = [0, 0, 2]
	const camera_target = [0, 0, 0]
	const camera_up = [0, 1, 0]
	const view_matrix = mat4.lookAt(camera_pos, camera_target, camera_up)

	const view_projection_matrix = mat4.multiply(projection_matrix, view_matrix)

	const encoder = device.createCommandEncoder()

	const pass = encoder.beginRenderPass({
		colorAttachments: [{
			view: context.getCurrentTexture().createView(),
			clearValue: [0.3, 0.3, 0.3, 1],
			loadOp: 'clear',
			storeOp: 'store',
		}]
	})
	pass.setPipeline(pipeline)

	objectInfos.forEach(({ bindGroups, matrix, uniformBuffer, uniformValues }, i) => {
		const bind_group = bindGroups[tex_index]

		const x = i % 4 - 1.5
		const y = i < 4 ? 1 : -1

		const x_spacing = 1
		const y_spacing = 0.7
		const z_depth = 50

		mat4.translate(view_projection_matrix, [x * x_spacing, y * y_spacing, -z_depth * 0.5], matrix)
		mat4.rotateX(matrix, 0.5 * Math.PI, matrix)
		mat4.scale(matrix, [1, z_depth * 2, 1], matrix)
		mat4.translate(matrix, [-0.5, -0.5, 0], matrix)

		device.queue.writeBuffer(uniformBuffer, 0, uniformValues)

		pass.setBindGroup(0, bind_group)
		pass.draw(6)
	})

	pass.end()

	device.queue.submit([encoder.finish()])
}

function render() {
	update()
}; render()

canvas.addEventListener("mousedown", () => {
	tex_index = (tex_index + 1) % textures.length
	render()
})

const gui = new GUI({ closeOnTop: true })
gui.add(settings, "minFilter").onChange(render)
gui.add(settings, "mipmapFilter").onChange(render)