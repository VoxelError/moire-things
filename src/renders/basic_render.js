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

const tex_width = 5
const tex_height = 7
const _ = [255, 0, 0, 255]
const y = [255, 255, 0, 255]
const b = [0, 0, 255, 255]
const tex_data = new Uint8Array([
	b, _, _, _, _,
	_, y, y, y, _,
	_, y, _, _, _,
	_, y, y, _, _,
	_, y, _, _, _,
	_, y, _, _, _,
	_, _, _, _, _,
].flat())

const sampler = device.createSampler()
const texture = device.createTexture({
	size: [tex_width, tex_height],
	format: 'rgba8unorm',
	usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
})
device.queue.writeTexture({ texture }, tex_data, { bytesPerRow: tex_width * 4 }, { width: tex_width, height: tex_height })

const module = device.createShaderModule({
	code: /* wgsl */`
		struct VertexOut {
			@builtin(position) pos: vec4f,
			@location(0) tex: vec2f,
		}
		
		@vertex
		fn vertex_main(@builtin(vertex_index) index: u32) -> VertexOut {
			let pos = array(
				vec2f(0, 0),
				vec2f(1, 0),
				vec2f(0, 1),
				vec2f(0, 1),
				vec2f(1, 0),
				vec2f(1, 1),
			);
		
			var out: VertexOut;
			out.pos = vec4f(pos[index], 0.0, 1.0);
			out.tex = pos[index];
			return out;
		}

		@group(0) @binding(0) var sampla: sampler;
		@group(0) @binding(1) var texture: texture_2d<f32>;
		
		@fragment
		fn fragment_main(in: VertexOut) -> @location(0) vec4f {
			// return vec4f(1, 1, 1, 1);
			return textureSample(texture, sampla, in.tex);
		}
    `,
})

const pipeline = device.createRenderPipeline({
	layout: 'auto',
	vertex: { module },
	fragment: {
		module, targets: [{ format }]
	}
})

const bind_group = device.createBindGroup({
	layout: pipeline.getBindGroupLayout(0),
	entries: [
		{ binding: 0, resource: sampler },
		{ binding: 1, resource: texture.createView() },
	],
})

!function render() {
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
}()