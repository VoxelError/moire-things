import { bind_entries, render_pass, setup } from "../util/helpers"

const { context, device, format } = await setup()

const tex_size = 7
const _ = [0, 0, 0, 255]
const R = [255, 0, 0, 255]
const Y = [255, 255, 0, 255]
const G = [0, 255, 0, 255]
const B = [0, 0, 255, 255]
const tex_data = new Uint8Array([
	_, _, _, Y, _, _, _,
	_, Y, Y, Y, G, B, _,
	_, Y, G, G, G, B, _,
	Y, Y, Y, R, B, B, B,
	_, Y, G, G, G, B, _,
	_, Y, G, B, B, B, _,
	_, _, _, B, _, _, _,
].flat())

const texture = device.createTexture({
	size: [tex_size, tex_size],
	format: 'rgba8unorm',
	usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
})
device.queue.writeTexture({ texture }, tex_data, { bytesPerRow: tex_size * 4 }, { width: tex_size, height: tex_size })

const module = device.createShaderModule({
	code: /* wgsl */`
		struct VertexOut {
			@builtin(position) pos: vec4f,
			@location(0) tex: vec2f,
		}

		@group(0) @binding(0) var tex_sampler: sampler;
		@group(0) @binding(1) var texture: texture_2d<f32>;
		
		@vertex
		fn vertex_main(@builtin(vertex_index) index: u32) -> VertexOut {
			let pos = array(
				vec2f(-1, -1),
				vec2f(1, -1),
				vec2f(-1, 1),

				vec2f(-1, 1),
				vec2f(1, 1),
				vec2f(1, -1),
			);
		
			var out: VertexOut;
			out.pos = vec4f(pos[index].x, -pos[index].y, 0, 1);
			out.tex = (pos[index] + 1) / 2;
			return out;
		}
		
		@fragment
		fn fragment_main(in: VertexOut) -> @location(0) vec4f {
			return textureSample(texture, tex_sampler, in.tex);
		}
    `
})

const pipeline = device.createRenderPipeline({
	layout: "auto",
	vertex: { module },
	fragment: { module, targets: [{ format }] }
})

const bind_group = device.createBindGroup({
	layout: pipeline.getBindGroupLayout(0),
	entries: bind_entries([device.createSampler(), texture.createView()])
})

!function render() {
	const encoder = device.createCommandEncoder()
	const pass = render_pass(encoder, context, [0.2, 0.2, 0.2, 1])

	pass.setPipeline(pipeline)
	pass.setBindGroup(0, bind_group)
	pass.draw(6)
	pass.end()

	device.queue.submit([encoder.finish()])
}()