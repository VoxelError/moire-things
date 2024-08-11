struct VertexIn {
	@builtin(vertex_index) vertex: u32,
	@location(0) pos: vec2f,
	@location(1) offset: vec2f,
	@location(2) scale: vec2f,
}

struct VertexOut {
	@builtin(position) pos: vec4f
}

@vertex
fn vertex_main(in: VertexIn) -> VertexOut {
    let scale = vec2f(in.scale.x * in.scale.y, in.scale.x);
    let props = in.pos * scale + in.offset;

    var out: VertexOut;
    out.pos = vec4f(props, 0, 1);
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    return vec4f(1, 1, 1, 1);
}