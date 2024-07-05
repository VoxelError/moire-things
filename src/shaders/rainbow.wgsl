struct VertexOut {
	@builtin(position) pos: vec4f,
	@location(0) color: vec4f,
}
 
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

    var color = array<vec4f, 3>(
        vec4f(1, 0, 0, 1),
        vec4f(0, 1, 0, 1),
        vec4f(0, 0, 1, 1),
    );

    var out: VertexOut;
    out.pos = vec4f(pos[index], 0.0, 1.0);
    out.color = color[index];
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    let dark = vec4f(0.33, 0.33, 0.33, 1);
    let light = vec4f(0.66, 0.66, 0.66, 1);

    let grid = vec2u(in.pos.xy) / 32;
    let checker = (grid.x + grid.y) % 6;
    // let checker = (grid.x + grid.y) % 2 == 1;

    // return select(dark, light, checker);

    if checker == 0 { return vec4f(1, 0, 0, 1); }
    if checker == 1 { return vec4f(1, 0.5, 0, 1); }
    if checker == 2 { return vec4f(1, 1, 0, 1); }
    if checker == 3 { return vec4f(0, 1, 0, 1); }
    if checker == 4 { return vec4f(0, 0, 1, 1); }
    if checker == 5 { return vec4f(0.5, 0, 1, 1); }
    return vec4f(1, 1, 1, 1);

    return in.color;
}