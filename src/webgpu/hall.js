import "../styles.scss"
import { mat4 } from 'https://webgpufundamentals.org/3rdparty/wgpu-matrix.module.js'
import { cursor, listen } from "../util/controls"
import shader from "../shaders/hall.wgsl?raw"
import { createBlendedMipmap, createCheckedMipmap, createTextureWithMips } from "./mip"
import { tau } from "../util/math"

const adapter = await navigator.gpu?.requestAdapter()
const device = await adapter?.requestDevice()

const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.append(canvas)

const context = canvas.getContext('webgpu')
const format = navigator.gpu.getPreferredCanvasFormat()
context.configure({ device, format })

const module = device.createShaderModule({ code: shader })

const pipeline = device.createRenderPipeline({
	layout: 'auto',
	vertex: { module },
	fragment: { module, targets: [{ format }] },
})

const textures = [
	createTextureWithMips(createBlendedMipmap(), device),
	createTextureWithMips(createCheckedMipmap(), device),
]

const objectInfos = []
for (let i = 0; i < 8; ++i) {
	const sampler = device.createSampler({
		addressModeU: 'repeat',
		addressModeV: 'repeat',
		magFilter: (i & 1) ? 'linear' : 'nearest',
		minFilter: (i & 2) ? 'linear' : 'nearest',
		mipmapFilter: (i & 4) ? 'linear' : 'nearest',
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

let tex_index = 0

function render() {
	const fov = tau / 6
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

		const x_spacing = 1.2
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

render()

listen(canvas)
cursor.click = () => {
	tex_index = (tex_index + 1) % textures.length
	render()
}