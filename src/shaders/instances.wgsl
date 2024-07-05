struct VertexIn {
	@builtin(vertex_index) vertex: u32,
	@builtin(instance_index) instance: u32,
}

struct VertexOut {
	@builtin(position) pos: vec4f,
	@location(0) color: vec4f,
}

struct Properties {
	color: vec4f,
	offset: vec2f,
	scale: vec2f,
}

@group(0) @binding(0) var<storage, read> props: array<Properties>;
 
@vertex
fn vertex_main(in: VertexIn) -> VertexOut {
    let pos = array(
        vec2f(0.5, 0.5),
        vec2f(0.5, -0.5),
        vec2f(-0.5, -0.5),
        vec2f(0.5, 0.5),
        vec2f(-0.5, 0.5),
        vec2f(-0.5, -0.5),
    );

    let prop = props[in.instance];

    var out: VertexOut;
    out.pos = vec4f(pos[in.vertex] * prop.scale + prop.offset, 0.0, 1.0);
	out.color = prop.color;
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    return in.color;
}