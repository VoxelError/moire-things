struct VertexOut {
	@builtin(position) pos: vec4f,
}

struct Properties {
	color: vec4f,
	offset: vec2f,
	scale: vec2f,
}

@group(0) @binding(0) var<storage, read> props: Properties;
 
@vertex
fn vertex_main(@builtin(vertex_index) index: u32) -> VertexOut {
    let pos = array(
        vec2f(0.5, 0.5),
        vec2f(0.5, -0.5),
        vec2f(-0.5, -0.5),
        vec2f(0.5, 0.5),
        vec2f(-0.5, 0.5),
        vec2f(-0.5, -0.5),
    );

    var out: VertexOut;
    out.pos = vec4f(pos[index] * props.scale + props.offset, 0.0, 1.0);
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    return props.color;
}