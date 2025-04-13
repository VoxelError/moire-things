override width: f32;
override height: f32;

const phi = radians(90.);
const pi = radians(180.);
const tau = radians(360.);

@group(0) @binding(0) var<uniform> cursor: vec2<f32>;
@group(0) @binding(1) var<uniform> aspect: f32;
@group(0) @binding(2) var<uniform> time: f32;

struct VertexOut {
	@builtin(position) pos: vec4f,
}

fn hsla(h: f32, s: f32, l: f32, a: f32) -> vec4f {
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

fn line(A: vec2f, B: vec2f, P: vec2f, thickness: f32) -> f32 {
    let t = saturate(dot(P - A, B - A) / dot(B - A, B - A));

    return step(length(P - mix(A, B, t)), thickness);
}

@vertex
fn vertex_main(@builtin(vertex_index) index: u32) -> VertexOut {
    let a = vec2f(1, 1);
    let b = vec2f(1, -1);
    let pos = array(a, b, -a, a, -b, -a);

    var out: VertexOut;
    out.pos = vec4f(pos[index], 0, 1);
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    let pos = (in.pos.xy / vec2f(width, height)) * 2 - 1;
    let uv = vec2f(pos.x, -pos.y);

    let a = vec2f(1, aspect);
    let c = cursor;

    var color: vec4<f32>;
    let max = 128;

    for (var i = 1; i <= max; i++) {
        let rate = time * 0.0001;
        let ratio = f32(i) / f32(max);
		let next = f32(i + 1) / f32(max);

        let v1 = vec2f(
            cos(tau * ratio),
            sin(tau * ratio),
        ) * rate;

        let v2 = vec2f(
            cos(tau * next),
            sin(tau * next),
		) * rate;

        let out = line(
			(1.0 - 4.0 * abs(0.5 - fract(v1 * 0.5 + 0.25))) * a,
			(1.0 - 4.0 * abs(0.5 - fract(v2 * 0.5 + 0.25))) * a,
			uv * a,
			0.0005
		);

        color += vec4f(out) * hsla(ratio, 1, 0.5, 1);
    }

    return color;
}