import { mat4 } from 'https://webgpufundamentals.org/3rdparty/wgpu-matrix.module.js'
import shader from "../shaders/textures3.wgsl?raw"
import shader2 from "../shaders/textures4.wgsl?raw"
import { phi, tau } from "../util/math"
import { setup } from '../util/helpers'

const { canvas, context, device, format } = await setup()

const module = device.createShaderModule({ code: shader })

const pipeline = device.createRenderPipeline({
	layout: 'auto',
	vertex: { module },
	fragment: { module, targets: [{ format }] },
})

const calc_mips = (...sizes) => Math.log2(Math.max(...sizes)) + 1 | 0

function copySourceToTexture(device, texture, source) {
	device.queue.copyExternalImageToTexture(
		{ source },
		{ texture },
		{ width: source.width, height: source.height },
	)

	if (texture.mipLevelCount > 1) {
		generateMips(device, texture)
	}
}

const generateMips = (() => {
	let sampler
	let module
	const pipelineByFormat = {}

	return function generateMips(device, texture) {
		if (!module) {
			module = device.createShaderModule({ code: shader2 })
			sampler = device.createSampler({ minFilter: 'linear' })
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

async function createTextureFromImage(url) {
	const source = await createImageBitmap(await (await fetch(url)).blob(), { colorSpaceConversion: 'none' })
	const texture = device.createTexture({
		format: 'rgba8unorm',
		mipLevelCount: calc_mips(source.width, source.height),
		size: [source.width, source.height],
		usage: GPUTextureUsage.TEXTURE_BINDING |
			GPUTextureUsage.COPY_DST |
			GPUTextureUsage.RENDER_ATTACHMENT,
	})
	copySourceToTexture(device, texture, source)
	return texture
}

const textures = [
	await createTextureFromImage('https://webgpufundamentals.org/webgpu/resources/images/f-texture.png'),
	await createTextureFromImage('https://webgpufundamentals.org/webgpu/resources/images/coins.jpg'),
	await createTextureFromImage('https://webgpufundamentals.org/webgpu/resources/images/Granite_paving_tileable_512x512.jpeg'),
]

const obj_props = []
for (let i = 0; i < 8; ++i) {
	const sampler = device.createSampler({
		addressModeU: 'repeat',
		addressModeV: 'repeat',
		magFilter: 'nearest',
		minFilter: 'linear',
		mipmapFilter: 'linear',
	})

	const u_buffer = device.createBuffer({ size: 64, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST })

	const u_values = new Float32Array(16)

	const bind_groups = textures.map(texture =>
		device.createBindGroup({
			layout: pipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: sampler },
				{ binding: 1, resource: texture.createView() },
				{ binding: 2, resource: { buffer: u_buffer } },
			]
		})
	)

	obj_props.push({
		bind_groups,
		u_buffer,
		u_values,
	})
}

let tex_index = 0

function render() {
	const encoder = device.createCommandEncoder()

	const pass = encoder.beginRenderPass({
		colorAttachments: [
			{
				view: context.getCurrentTexture().createView(),
				clearValue: [0, 0, 0, 1],
				loadOp: 'clear',
				storeOp: 'store',
			}
		]
	})

	pass.setPipeline(pipeline)

	obj_props.forEach((obj, i) => {
		const { bind_groups, u_buffer, u_values } = obj

		mat4.translate(
			mat4.multiply(
				mat4.perspective(
					tau / 6,
					canvas.width / canvas.height,
					1,
					2000,
				),
				mat4.lookAt(
					[0, 0, 2],
					[0, 0, 0],
					[0, 1, 0],
				),
			),
			[
				(i % 4) - 1.5,
				(i < 4 ? 1 : -1) * 0.7,
				-25
			],
			u_values,
		)
		mat4.rotateX(u_values, phi, u_values)
		mat4.scale(u_values, [1, 100, 1], u_values)
		mat4.translate(u_values, [-0.5, -0.5, 0], u_values)

		device.queue.writeBuffer(u_buffer, 0, u_values)

		pass.setBindGroup(0, bind_groups[tex_index])
		pass.draw(6)
	})

	pass.end()

	device.queue.submit([encoder.finish()])
}

render()

canvas.addEventListener('click', () => {
	tex_index = (tex_index + 1) % textures.length
	render()
})