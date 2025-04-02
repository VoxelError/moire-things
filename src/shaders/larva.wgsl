override width: f32;
override height: f32;

const phi = radians(90.);
const pi = radians(180.);
const tau = radians(360.);

@group(0) @binding(0) var<uniform> cursor: vec2<f32>;
@group(0) @binding(1) var<uniform> aspect: f32;
@group(0) @binding(2) var<uniform> time: f32;

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

fn circle(p1: vec2f, uv: vec2f, radius: f32, in_radius: f32) -> f32 {
    let width = step(length(p1 - uv), radius);

    return 0.5 * width * step(in_radius, length(p1 - uv));
}

fn line(p1: vec2f, p2: vec2f, uv: vec2f, thickness: f32) -> f32 {
    let t = saturate(dot(p2 - p1, uv - p1) / dot(p2 - p1, p2 - p1));
    let p3 = mix(p1, p2, t);

    let width = step(length(p3 - uv), thickness);
    let check = select(0.0, 1.0, t >= 0 && t <= 1);

    return 0.5 * width * check;
}

// P1 * (1 - t)² + 
// P2 * 2 * (1 - t) * t + 
// P3 * t²

// P1 * 2 * (t - 1) - 
// P2 * (4 * t + 2) +
// P3 * 2 * t

fn bezier(p1: vec2f, p2: vec2f, c1: vec2f, uv: vec2f, thickness: f32) -> f32 {
    let t = saturate(dot(p2 - p1, uv - p1) / dot(p2 - p1, p2 - p1));
    let p4 = mix(
        mix(p1, c1, t),
        mix(c1, p2, t),
        t,
    );

    let pp1 = mix(p1, c1, sin(time * 0.0005) * 0.5 + 0.5);
    let pp2 = mix(c1, p2, sin(time * 0.0005) * 0.5 + 0.5);
    let pp3 = mix(pp1, pp2, sin(time * 0.0005) * 0.5 + 0.5);
    let v1 = pp2 - pp1;
    let v2 = normalize(vec2f(v1.y, -v1.x));
    let p5 = mix(
        pp3,
        v2,
        saturate(dot(v2 - pp3, uv - pp3) / dot(v2 - pp3, v2 - pp3))
		// time * 0.0005 % 1
    );

    // let width = step(length(p4 - uv), thickness);
    let width = step(length(vec2f(p4 - uv)), thickness / 4) + step(length(vec2f(p5 - uv)), thickness / 4);
    let color = 0.5 * width;

    return color;
}

@vertex
fn vertex_main(@builtin(vertex_index) index: u32) -> @builtin(position) vec4f {
    let a = vec2f(1, 1);
    let b = vec2f(1, -1);
    let pos = array(a, b, -a, a, -b, -a)[index];
    return vec4f(pos, 0, 1);
}

@fragment
fn fragment_main(@builtin(position) in: vec4f) -> @location(0) vec4f {
    let t = sin(time * 0.001) * 0.5 + 0.5;
    let pos = (in.xy / vec2f(width, height)) * 2 - 1;
    let uv = vec2f(pos.x, -pos.y);

    let a = vec2f(1, aspect);
    let c = cursor;

    let p1 = vec2f(0, 0);
    let p2 = vec2f(0.5, 0);
    let p3 = vec2f(0.25, 0.25);

    var color: vec4<f32>;

    // color += line(p1, p2, uv * a, 0.01);
    // color += circle(vec2f(0, 0), uv * a, 0.5, 0.1);

    let larvae = 16;

    for (var i = 1; i <= larvae; i++) {
        let timer = time * 0.00005;
        let theta = timer * f32(i) * tau / f32(larvae);

        let radius = 0.5;
        let gap: f32 = 0.05;

        for (var g = gap; g <= radius; g += gap) {
            color += circle(
                vec2f(
                    cos(theta) * (radius - g),
                    sin(theta) * (radius - g),
                ),
                uv * a,
                g,
                g - 0.0025,
            ) * hsla(0, 1, 0.5, 1 - g / radius);
        }
    }

    return color;
}

// import { draw_arc } from "../util/draws"
// import { cos, cos_wave, degrees, sin, tau } from "../util/math"

// export default (context, count, points, size) => {
// 	const larvae = 3

// 	for (let l = 1; l <= larvae; l++) {
// 		const time = degrees(count) * l
// 		const theta = time * 0.05

// 		const layers = size.y * 0.45
// 		const gap = 3

// 		for (let i = gap; i <= layers; i += gap) {
// 			draw_arc(context, {
// 				center: [
// 					(size.x / 2) + cos(theta) * (layers - i),
// 					(size.y / 2) - sin(theta) * (layers - i),
// 					// width / 2,
// 					// height / 2
// 				],
// 				radius: i,
// 				stroke: {
// 					style: "red",
// 					// alpha: 1 / larvae,
// 					alpha: 0.8 - i / layers,
// 				}
// 			})
// 		}
// 	}
// }