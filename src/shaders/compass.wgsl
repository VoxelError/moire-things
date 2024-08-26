const phi = radians(90.);
const pi = radians(180.);
const tau = radians(360.);

@group(0) @binding(0) var<uniform> cursor: vec2<f32>;
@group(0) @binding(1) var<uniform> aspect: f32;
@group(0) @binding(2) var<uniform> facing: u32;

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
    let radius = distance(in.x, in.y);
    let theta = atan2(in.y * aspect, in.x);

    return vec2f(radius, theta);
}

fn get_pos(index: u32, radius: f32) -> vec2f {
    let subturn = tau / 3;
    let vertices = array(
        vec2f(radius, 0),
        vec2f(0.02, pi - 0.33),
        vec2f(0.02, pi + 0.33),
    );
    return vertices[index];
}

@vertex
fn vertex_main(in: VertexIn) -> VertexOut {
    let theta = (in.delta.x - in.delta.y) * 0.00001;
    let size = 0.3;
    let scale = vec2f(size * aspect, size);

    let mouse = radial(cursor - in.offset);
    let pos = get_pos(in.vertex, 0.02);
    // let pos = get_pos(in.vertex, mouse.x);

    let direction = select(0, pi, facing == 1);

    let rot = vec2f(
        pos.x * cos(pos.y + mouse.y + direction) * aspect,
        pos.x * sin(pos.y + mouse.y + direction),
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