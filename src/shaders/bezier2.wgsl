override width: f32;
override height: f32;

const phi = radians(90.);
const pi = radians(180.);
const tau = radians(360.);

@group(0) @binding(0) var<uniform> cursor: vec2<f32>;
@group(0) @binding(1) var<uniform> aspect: f32;
@group(0) @binding(2) var<uniform> time: f32;

fn nml(n: vec2f) -> vec2f {
    return normalize(n);
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

fn circle(p1: vec2f, uv: vec2f, radius: f32, in_radius: f32) -> f32 {
    let width = step(length(p1 - uv), radius);

    return width * step(in_radius, length(p1 - uv));
}

fn line(p1: vec2f, p2: vec2f, uv: vec2f, thickness: f32) -> f32 {
    let t = saturate(dot(p2 - p1, uv - p1) / dot(p2 - p1, p2 - p1));
    let p3 = mix(p1, p2, t);

    let width = step(length(p3 - uv), thickness);
    let check = select(0.0, 1.0, t >= 0 && t <= 1);

    return width * check;
}

fn curveProjection(p: vec2f, c: vec2f, t: f32) -> vec2f {
    let t2 = t * t;
    let t3 = t2 * t;
    let x = (1 - t) * (1 - t) * (1 - t) * p.x + 3 * (1 - t) * (1 - t) * t * c.x + 3 * (1 - t) * t * t * c.x + t * t * t * c.x;
    let y = (1 - t) * (1 - t) * (1 - t) * p.y + 3 * (1 - t) * (1 - t) * t * c.y + 3 * (1 - t) * t * t * c.y + t * t * t * c.y;
    return vec2f(x, y);
}

fn proja(a: vec2f, b: vec2f, c: vec2f, uv: vec2f) -> f32 {
    var closestDist = 1000.0;
    var closestT = 0.0;

    for (var t = 0.0; t < 1.0; t += 0.01) {
        let p = curveProjection(a, b, t);
        let dist = distance(p, uv);
        if dist < closestDist {
            closestDist = dist;
            closestT = t;
        }
    }

    return closestT;
}

fn proj(a: vec2f, b: vec2f) -> f32 {
    return dot(a, b) / dot(b, b);
}

fn bezier(p1: vec2f, p2: vec2f, c1: vec2f, uv: vec2f, thickness: f32) -> f32 {
    let t = proj(uv - p1, p2 - p1);

    let start = proj(uv - p1, c1 - p1);
    let end = proj(uv - c1, p2 - c1);
    let bounds = step(0, start) * step(end, 1);

    let point = mix(
        mix(p1, c1, t),
        mix(c1, p2, t),
        t,
    );

    let q_deriv = 2 * (1 - t) * (c1 - p1) + 2 * t * (p2 - c1);

    let tangent = normalize(q_deriv);
    let normal = vec2f(-tangent.y, tangent.x);
    let dist_to_curve = abs(dot(uv - point, normal));

    let width = step(dist_to_curve, thickness);
    // let width = smoothstep(1, 0, dist_to_curve / thickness);

    return bounds * width;
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

    // let max = 64;

    // for (var i = 1; i <= max; i++) {
    //     let rate = time * 0.00025;
    //     let theta = tau * f32(i) / f32(max) + rate;
    //     let radius = 0.3;

    //     let v1 = vec2f(
    //         cos(phi + theta),
    //         sin(phi + theta),
    //     ) * radius * sin(theta + rate);

    //     let v2 = vec2f(
    //         cos(phi + theta),
    //         sin(phi + theta),
    //     ) * radius;

    //     let out = line(v1, v2, uv * a, 0.0005);
    //     let hue = hsla(theta / tau % 1, 1, 0.5, 1);

    //     color += vec4f(out) * hue;
    // }

    color += bezier(
        p1,
        vec2f(
            // cos(time * 0.001) * 0.5,
            // sin(time * 0.001) * 0.5
            0, 0.5
        ),
        c * a,
        uv * a,
        0.01
    ) * 0.1;

    color += circle(
        p1,
        uv * a,
        0.01,
        0,
    ) * hsla(0, 1, 0.5, 1);

    color += circle(
        p1,
        uv * a,
        0.01,
        0,
    ) * hsla(-0.8, 1, 0.5, 1);

    color += circle(
        p1,
        uv * a,
        0.01,
        0,
    ) * hsla(0, 1, 0.5, 1);

    return color;
}