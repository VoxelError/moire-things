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

fn hsl(h: f32, s: f32, l: f32, a: f32) -> vec4f {
    let hue = h * 6;
    let c = (1 - abs(2 * l - 1)) * s;
    let x = c * (1 - abs(hue % 2 - 1));
    let m = l - c / 2;
    var point = vec3f(0);

    if hue >= 0 && hue <= 1 { point = vec3f(c, x, 0); }
    if hue >= 1 && hue <= 2 { point = vec3f(x, c, 0); }
    if hue >= 2 && hue <= 3 { point = vec3f(0, c, x); }
    if hue >= 3 && hue <= 4 { point = vec3f(0, x, c); }
    if hue >= 4 && hue <= 5 { point = vec3f(x, 0, c); }
    if hue >= 5 && hue <= 6 { point = vec3f(c, 0, x); }

    return vec4f((point + m) * a, a);
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
    let color = hsl(
        in.color.x,
        in.color.y,
        in.color.z,
        in.color.w,
    );

    // let theta = atan2(props.y, props.x);
    let theta = (in.delta.x - in.delta.y) * 0.005;

    // let offset = radial(vec2f(theta * 0.0015, 0.1)) + in.offset;
    let radius = vec2f(0.1 * in.scale.y, 0.1);
    let offset = vec2f(
        sin(sin(theta)),
        cos(sin(theta)),
    ) * radius + vec2f(in.offset.x, in.offset.y - radius.y);
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