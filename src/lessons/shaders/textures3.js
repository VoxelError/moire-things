export default /* wgsl */`

struct VertexOut {
	@builtin(position) pos: vec4f,
	@location(0) tex: vec2f,
}

@group(0) @binding(0) var ourSampler: sampler;
@group(0) @binding(1) var ourTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> matrix: mat4x4f;

@vertex
fn vs(@builtin(vertex_index) index: u32) -> VertexOut {
    let pos = array(
        vec2f(0.0, 0.0),
        vec2f(1.0, 0.0),
        vec2f(0.0, 1.0),
        vec2f(0.0, 1.0),
        vec2f(1.0, 0.0),
        vec2f(1.0, 1.0),
    );

    var out: VertexOut;
    let xy = pos[index];
    out.pos = matrix * vec4f(xy, 0.0, 1.0);
    out.tex = xy * vec2f(1, 50);
    return out;
}

@fragment
fn fs(in: VertexOut) -> @location(0) vec4f {
    return textureSample(ourTexture, ourSampler, in.tex);
}

`