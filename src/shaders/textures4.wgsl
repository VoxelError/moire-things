struct VertexOut {
	@builtin(position) pos: vec4f,
	@location(0) tex: vec2f,
}

@group(0) @binding(0) var ourSampler: sampler;
@group(0) @binding(1) var ourTexture: texture_2d<f32>;

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
    out.pos = vec4f(xy * 2.0 - 1.0, 0.0, 1.0);
    out.tex = vec2f(xy.x, 1.0 - xy.y);
    return out;
}

@fragment 
fn fs(in: VertexOut) -> @location(0) vec4f {
    return textureSample(ourTexture, ourSampler, in.tex);
}