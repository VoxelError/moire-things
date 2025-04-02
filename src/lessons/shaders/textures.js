export default /* wgsl */`

struct VertexOut {
	@builtin(position) pos: vec4f,
	@location(0) tex: vec2f,
}

struct Properties {
	scale: vec2f,
	offset: vec2f,
}

@group(0) @binding(2) var<uniform> props: Properties;

@vertex
fn vertex_main(@builtin(vertex_index) index: u32) -> VertexOut {
    let pos_array = array(
        vec2f(0, 0),
        vec2f(1, 0),
        vec2f(0, 1),
        vec2f(0, 1),
        vec2f(1, 0),
        vec2f(1, 1),
    );

    let pos = pos_array[index];

    var out: VertexOut;
    out.pos = vec4f(pos, 0.0, 1.0);
    out.pos = vec4f(pos * props.scale + props.offset, 0.0, 1.0);
    out.tex = vec2f(pos.x, 1 - pos.y);
    return out;
}

@group(0) @binding(0) var sampla: sampler;
@group(0) @binding(1) var texture: texture_2d<f32>;

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
	// return vec4f(1, 1, 1, 1);
    return textureSample(texture, sampla, in.tex);
}

`