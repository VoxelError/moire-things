import { mat4 } from 'https://webgpufundamentals.org/3rdparty/wgpu-matrix.module.js'
import shader from "../shaders/textures3.wgsl?raw"
import shader2 from "../shaders/textures4.wgsl?raw"
import { canvas2, update_canvas2 } from './mip3'
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
	fragment: { module, targets: [{ format: format }] },
})

const numMipLevels = (...sizes) => {
	const max_size = Math.max(...sizes)
	return 1 + Math.log2(max_size) | 0
}

async function loadImageBitmap(url) {
	const res = await fetch(url);
	const blob = await res.blob();
	return await createImageBitmap(blob, { colorSpaceConversion: 'none' });
}

function copySourceToTexture(device, texture, source, { flipY } = {}) {
	device.queue.copyExternalImageToTexture(
		{ source, flipY, },
		{ texture },
		{ width: source.width, height: source.height },
	);

	if (texture.mipLevelCount > 1) {
		generateMips(device, texture);
	}
}

function createTextureFromSource(device, source, options = {}) {
	const texture = device.createTexture({
		format: 'rgba8unorm',
		mipLevelCount: options.mips ? numMipLevels(source.width, source.height) : 1,
		size: [source.width, source.height],
		usage: GPUTextureUsage.TEXTURE_BINDING |
			GPUTextureUsage.COPY_DST |
			GPUTextureUsage.RENDER_ATTACHMENT,
	});
	copySourceToTexture(device, texture, source, options);
	return texture;
}

const generateMips = (() => {
	let sampler;
	let module;
	const pipelineByFormat = {};

	return function generateMips(device, texture) {
		if (!module) {
			module = device.createShaderModule({
				label: 'textured quad shaders for mip level generation',
				code: shader2,
			})

			sampler = device.createSampler({
				minFilter: 'linear',
			});
		}

		if (!pipelineByFormat[texture.format]) {
			pipelineByFormat[texture.format] = device.createRenderPipeline({
				label: 'mip level generator pipeline',
				layout: 'auto',
				vertex: {
					module,
				},
				fragment: {
					module,
					targets: [{ format: texture.format }],
				},
			});
		}
		const pipeline = pipelineByFormat[texture.format];

		const encoder = device.createCommandEncoder({
			label: 'mip gen encoder',
		});

		let width = texture.width;
		let height = texture.height;
		let baseMipLevel = 0;
		while (width > 1 || height > 1) {
			width = Math.max(1, width / 2 | 0);
			height = Math.max(1, height / 2 | 0);

			const bindGroup = device.createBindGroup({
				layout: pipeline.getBindGroupLayout(0),
				entries: [
					{ binding: 0, resource: sampler },
					{ binding: 1, resource: texture.createView({ baseMipLevel, mipLevelCount: 1 }) },
				],
			});

			++baseMipLevel;

			const renderPassDescriptor = {
				label: 'our basic canvas renderPass',
				colorAttachments: [
					{
						view: texture.createView({ baseMipLevel, mipLevelCount: 1 }),
						loadOp: 'clear',
						storeOp: 'store',
					},
				],
			};

			const pass = encoder.beginRenderPass(renderPassDescriptor);
			pass.setPipeline(pipeline);
			pass.setBindGroup(0, bindGroup);
			pass.draw(6);  // call our vertex shader 6 times
			pass.end();
		}

		const commandBuffer = encoder.finish();
		device.queue.submit([commandBuffer]);
	};
})();

async function createTextureFromImage(device, url, options) {
	const imgBitmap = await loadImageBitmap(url);
	return createTextureFromSource(device, imgBitmap, options);
}

const urls = [
	'https://webgpufundamentals.org/webgpu/resources/images/f-texture.png',
	'https://webgpufundamentals.org/webgpu/resources/images/coins.jpg',
	'https://webgpufundamentals.org/webgpu/resources/images/Granite_paving_tileable_512x512.jpeg',
]

// const textures = await Promise.all([
// 	await createTextureFromImage(device, urls[0], { mips: true }),
// 	await createTextureFromImage(device, urls[1], { mips: true }),
// 	await createTextureFromImage(device, urls[2], { mips: true }),
// ])

const texture = createTextureFromSource(device, canvas2, { mips: true })
const textures = [texture]

const objectInfos = []
for (let i = 0; i < 8; ++i) {
	const sampler = device.createSampler({
		addressModeU: 'repeat',
		addressModeV: 'repeat',
		magFilter: 'linear',
		minFilter: 'linear',
		mipmapFilter: 'linear',
	})

	const uniformBufferSize = 16 * 4
	const uniformBuffer = device.createBuffer({
		label: 'uniforms for quad',
		size: uniformBufferSize,
		usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
	})

	// create a typedarray to hold the values for the uniforms in JavaScript
	const uniformValues = new Float32Array(uniformBufferSize / 4);
	const matrix = uniformValues.subarray(0, 16);

	const bindGroups = textures.map(texture =>
		device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: sampler },
				{ binding: 1, resource: texture.createView() },
				{ binding: 2, resource: { buffer: uniformBuffer } },
			],
		})
	)

	objectInfos.push({
		bindGroups,
		matrix,
		uniformValues,
		uniformBuffer,
	});
}

const renderPassDescriptor = {
	colorAttachments: [
		{
			clearValue: [0.3, 0.3, 0.3, 1],
			loadOp: 'clear',
			storeOp: 'store',
		}
	]
}

let tex_index = 0;

!function render(time) {
	update_canvas2(time)
	copySourceToTexture(device, texture, canvas2)

	const fov = tau * 0.16
	const aspect = canvas.clientWidth / canvas.clientHeight
	const zNear = 1
	const zFar = 2000
	const projectionMatrix = mat4.perspective(fov, aspect, zNear, zFar)

	const cameraPosition = [0, 0, 2]
	const up = [0, 1, 0]
	const target = [0, 0, 0]
	const viewMatrix = mat4.lookAt(cameraPosition, target, up)
	const viewProjectionMatrix = mat4.multiply(projectionMatrix, viewMatrix)

	renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView()

	const encoder = device.createCommandEncoder()
	const pass = encoder.beginRenderPass(renderPassDescriptor)
	pass.setPipeline(pipeline)

	objectInfos.forEach(({ bindGroups, matrix, uniformBuffer, uniformValues }, i) => {
		const bindGroup = bindGroups[tex_index]

		const xSpacing = 1
		const ySpacing = 0.7
		const zDepth = 50

		const x = i % 4 - 1.5
		const y = i < 4 ? 1 : -1

		mat4.translate(viewProjectionMatrix, [x * xSpacing, y * ySpacing, -zDepth * 0.5], matrix)
		mat4.rotateX(matrix, 0.5 * Math.PI, matrix)
		mat4.scale(matrix, [1, zDepth * 2, 1], matrix)
		mat4.translate(matrix, [-0.5, -0.5, 0], matrix)

		device.queue.writeBuffer(uniformBuffer, 0, uniformValues)

		pass.setBindGroup(0, bindGroup)
		pass.draw(6)
	})

	pass.end()

	const commandBuffer = encoder.finish()
	device.queue.submit([commandBuffer])

	requestAnimationFrame(render)
}()