struct VertexIn {
	@builtin(vertex_index) index: u32,
	@location(0) pos: vec2f,
	@location(1) offset: vec2f,
	@location(2) scale: vec2f,
	@location(3) time: vec2f,
	@location(4) color: vec4f,
}

struct VertexOut {
	@builtin(position) pos: vec4f,
	@location(0) color: vec4f,
}

fn hsl(in: vec4f) -> vec4f {
    let h: f32 = in.x;
    let s: f32 = in.y;
    let l: f32 = in.z;
    let a: f32 = in.w;

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

@vertex
fn vertex_main(in: VertexIn) -> VertexOut {
	// let aspect = width / height;
    let scale = vec2f(in.scale.x * in.scale.y, in.scale.x);
    let rot = vec2f(
        cos(in.pos.x + in.time.x * in.time.y),
        sin(in.pos.x + in.time.x * in.time.y),
    ) * scale;

	let in_radius = in.offset.x / in.offset.y + select(
		0,
		1.75 / in.offset.y,
		in.pos.y == 0
	);

    var out: VertexOut;
    out.pos = vec4f(rot * in_radius, 0, 1);
    out.color = hsl(in.color);
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    return in.color;
}