struct VertexOut {
	@builtin(position) pos: vec4f,
}

@vertex
fn vertex_main(@builtin(vertex_index) index: u32) -> VertexOut {
    let scale = 1.0;
    let pos = array(
        vec2f(scale, scale),
        vec2f(scale, -scale),
        vec2f(-scale, -scale),
        vec2f(scale, scale),
        vec2f(-scale, scale),
        vec2f(-scale, -scale),
    );

    var out: VertexOut;
    out.pos = vec4f(pos[index], 0.0, 1.0);
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    let tile_size: u32 = 16;
    let grid = vec2u(in.pos.xy) / tile_size;
    let checker = (grid.x + grid.y) % 6;

	// return select(
	// 	vec4f(0.33, 0.33, 0.33, 1),
	// 	vec4f(0.66, 0.66, 0.66, 1),
	// 	(grid.x + grid.y) % 2 == 1,
	// );

    let colors = array(
        vec3f(1.0, 0.0, 0.0),
        vec3f(1.0, 0.5, 0.0),
        vec3f(1.0, 1.0, 0.0),
        vec3f(0.0, 1.0, 0.0),
        vec3f(0.0, 0.0, 1.0),
        vec3f(0.5, 0.0, 1.0),
    );

    return vec4f(colors[checker] * 0.8, 1);
}