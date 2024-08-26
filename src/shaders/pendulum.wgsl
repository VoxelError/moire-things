const phi = radians(90.);
const pi = radians(180.);
const tau = radians(360.);

struct VertexIn {
	@builtin(vertex_index) vertex: u32,
	@location(0) pos: vec2f,
	@location(1) offset: vec2f,
	@location(2) scale: vec2f,
	@location(3) color: vec4f,
	@location(4) delta: vec2f,
}

struct VertexOut {
	@builtin(position) pos: vec4f,
	@location(0) color: vec4f,
}

fn radial(in: vec2f) -> vec2f {
    return vec2f(
        cos(in.x) * in.y,
        sin(in.x) * in.y,
    );
}

@vertex
fn vertex_main(in: VertexIn) -> VertexOut {
    let scale = vec2f(in.scale.x * in.scale.y, in.scale.x);
    let color = vec4f(0.5, 0.5, 0.5, 1);

    let radius = 0.3;
    let amplitude = tau * 0.1;

    let theta = (in.delta.x - in.delta.y) * 0.005;
    let length = vec2f(radius * in.scale.y, radius);

    let gravity = 9.82;
    let motion = cos(1 / sqrt(radius / gravity) * theta * 0.15) * amplitude;

    // let offset = radial(vec2f(theta * 0.0015, 0.1)) + in.offset;
    let offset = vec2f(
        sin(motion),
        -cos(motion),
    ) * length + in.offset;
    let props = radial(in.pos) * scale + offset;

    var out: VertexOut;
    out.pos = vec4f(props, 0, 1);
    out.color = select(
        color,
        color * vec4f(0.25, 0.25, 0.25, 0),
        in.vertex % 2 == 0,
    );
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    return in.color;
}