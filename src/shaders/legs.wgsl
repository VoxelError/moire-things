const phi = radians(90.);
const pi = radians(180.);
const tau = radians(360.);

@group(0) @binding(0) var<uniform> cursor: vec2<f32>;
@group(0) @binding(1) var<uniform> aspect: f32;

struct VertexIn {
	@builtin(vertex_index) vertex: u32,
	@location(0) offset: vec2f,
	@location(1) delta: vec2f,
}

struct VertexOut {
	@builtin(position) pos: vec4f,
	@location(0) color: vec4f,
}

fn radial(in: vec2f) -> vec2f {
    let radius = length(in);
    let theta = atan2(in.y, in.x);

    return vec2f(radius, theta);
}

fn get_pos(index: u32, radius: f32) -> vec2f {
    let subturn = tau / 3;
    let vertices = array(
        vec2f(radius, 0),
        vec2f(-0.1, 0),
        vec2f(0.02, pi - phi),
        vec2f(0.02, pi + phi),
    );
    let indices = array(0, 2, 3, 1, 2, 3);
    return vertices[(indices[index])];
}

@vertex
fn vertex_main(in: VertexIn) -> VertexOut {
    let theta = (in.delta.x - in.delta.y) * 0.00001;

    let diff = cursor - in.offset;
    let mouse = radial(vec2f(diff.x, diff.y * aspect));
    let pos = get_pos(in.vertex, min(0.5, mouse.x));

    let rot = vec2f(
        pos.x * cos(pos.y + mouse.y) * aspect,
        pos.x * sin(pos.y + mouse.y),
    ) + in.offset;

    var out: VertexOut;
    out.pos = vec4f(rot, 0, 1);
    out.color = vec4f(0.15);
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    return in.color;
}