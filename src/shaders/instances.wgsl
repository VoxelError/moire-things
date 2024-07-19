struct VertexIn {
	@builtin(vertex_index) vertex: u32,
	@location(0) pos: vec2f,
	@location(1) color: vec4f,
	@location(2) offset: vec2f,
	@location(3) scale: vec2f,
	@location(4) vertex_color: vec4f,
}

struct VertexOut {
	@builtin(position) pos: vec4f,
	@location(0) color: vec4f,
}

@vertex
fn vertex_main(in: VertexIn) -> VertexOut {
    var out: VertexOut;
    out.pos = vec4f(in.pos * in.scale + in.offset, 0, 1);
    out.color = in.color * in.vertex_color;
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    return in.color;
}