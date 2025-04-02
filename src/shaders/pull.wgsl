override width: f32;
override height: f32;

@group(0) @binding(0) var<uniform> cursor: vec2<f32>;
@group(0) @binding(1) var<uniform> aspect: f32;

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

fn line(p1: vec2f, p2: vec2f, uv: vec2f) -> bool {
    let dist = mix(
        p1,
        p2,
        // min(
        //     distance(p1, uv) / distance(p1, p2),
        //     1,
        // )
        // (distance(p1, uv) / distance(p1, p2)) * 0.9
        min(distance(p1, p2), 0.5)
    );
    let thickness = 0.02;

    return distance(dist, uv * 0.5) < thickness;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    let dims = vec2f(width, height);
    let pos = (in.pos.xy / dims) * 2 - 1;
    let uv = vec2f(pos.x, -pos.y);
    let tile_size: u32 = 40;
    let grid = vec2u(in.pos.xy) / tile_size;
    let checker = (grid.x + grid.y) % 6;

	// return select(
	// 	vec4f(0.33, 0.33, 0.33, 1),
	// 	vec4f(0.66, 0.66, 0.66, 1),
	// 	(grid.x + grid.y) % 2 == 1,
	// );

    let colors = array(
        vec4f(1.0, 0.0, 0.0, 1.0),
        vec4f(1.0, 0.5, 0.0, 1.0),
        vec4f(1.0, 1.0, 0.0, 1.0),
        vec4f(0.0, 1.0, 0.0, 1.0),
        vec4f(0.0, 0.0, 1.0, 1.0),
        vec4f(0.5, 0.0, 1.0, 1.0),
    );

    // return colors[checker] * 0.8;

    let a = vec2f(1, aspect);

    // let c = cursor * uva;
    let c = cursor * a;
    let p1 = vec2f(-0.5, -0.5);
    let p2 = vec2f(-0.5, 0);
    let p3 = vec2f(0, 0);
    let p4 = vec2f(0, -0.5);

    let l1 = line(p1, p2, uv * a);
    let l2 = line(p2, p3, uv * a);
    let l3 = line(p3, p4, uv * a);
    let l4 = line(p4, p1, uv * a);
    let l5 = line(p4, c, uv * a);
    let l6 = line(p3, c, uv * a);

	// let check = uv.y < uv.x && uv.y > uv.x - 0.003;
	// let check = distance(vec2f(0), uv) < 0.25;
    // let check = l6 || line(p3, p3, uv * a);
    let check = l6;
	let circle = length(uv * a) < 0.5 && length(uv * a) > 0.495;

    if check || circle {
        return vec4f(sin(uv.x) * 0.25 + 0.25);
    } else {
        return vec4f(0);
    }
}