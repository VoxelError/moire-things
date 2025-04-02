override width: f32;
override height: f32;

const phi = radians(90.);
const pi = radians(180.);
const tau = radians(360.);

@group(0) @binding(0) var<uniform> cursor: vec2<f32>;
@group(0) @binding(1) var<uniform> aspect: f32;
@group(0) @binding(2) var<uniform> time: f32;

fn cbrt(x: f32) -> f32 {
    return pow(x, 1.0 / 3.0);
}

fn hsla(h: f32, s: f32, l: f32, a: f32) -> vec4f {
    let hue = h * 6;
    // let c = (1 - abs(2 * l - 1)) * s;
    let c = (1 - abs(l * 2 - 1)) * s;
    let x = c * (1 - abs(hue % 2 - 1));
    let m = l - c / 2;
    var point: vec3f;

    if hue >= 0 && hue <= 1 { point = vec3f(c, x, 0); }
    if hue >= 1 && hue <= 2 { point = vec3f(x, c, 0); }
    if hue >= 2 && hue <= 3 { point = vec3f(0, c, x); }
    if hue >= 3 && hue <= 4 { point = vec3f(0, x, c); }
    if hue >= 4 && hue <= 5 { point = vec3f(x, 0, c); }
    if hue >= 5 && hue <= 6 { point = vec3f(c, 0, x); }

    return vec4f((point + m) * a, a);
}

fn circle(uv: vec2f, pos: vec2f, radius: f32) -> f32 {
    return -length(uv - pos) + radius;
}

fn line(P1: vec2f, P2: vec2f, UV: vec2f, THICK: f32) -> f32 {
    let t = saturate(dot(P2 - P1, UV - P1) / dot(P2 - P1, P2 - P1));
    let p3 = mix(P1, P2, t);

    let width = step(length(p3 - UV), THICK);
    let check = select(0.0, 1.0, t >= 0 && t <= 1);

    return width * check;
}

fn bezier(P1: vec2f, P2: vec2f, P3: vec2f, uv: vec2f, thickness: f32) -> f32 {
    let A = P2 - P1;
    let B = P3 - P2 - A;
    let C = 2 * A;
    let D = P1 - uv;

    let k = vec3f(
        dot(A, B),
        dot(B, D) + dot(A, C),
        dot(A, D),
    ) / dot(B, B);

    let p = k.y / 3 - k.x * k.x;
    let q = 2 * k.x * k.x * k.x - k.x * k.y + k.z;

    let h = sqrt(q * q + 4 * p * p * p);

    var result: f32;

    if h >= 0 {
        let pos = vec2f(
            cbrt(abs(h - q) / 2) * sign(h - q),
            cbrt(abs(-h - q) / 2) * sign(-h - q)
        );
        let t = saturate(pos.x + pos.y - dot(A, B) / dot(B, B));
        result = length(B * t * t + C * t + D);
    } else {
        let v = acos(q / (p * sqrt(-p) * 2)) / 3;
        let w = vec2f(
            2,
            -(1 + tan(v) * sqrt(3))
        ) * sqrt(-p) * cos(v) - dot(A, B) / dot(B, B);
        let t1 = saturate(w.x);
        let t2 = saturate(w.y);

        result = min(
            length(B * t1 * t1 + C * t1 + D),
            length(B * t2 * t2 + C * t2 + D)
        );
    }

    return step(result, thickness);
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
    let a = vec2f(1, aspect);
    let c = cursor * a;
    let uv = pos * vec2f(1, -1) * a;

    var color: vec4<f32>;
    let amount = 32;

    for (var i = 1; i <= amount; i++) {
        let rate = time * 0.0001;
        let theta = tau * f32(i) / f32(amount);
        let flip = sign(f32(i % 2) - 0.5);

        color += hsla(1, 0.5, 0.5, 0.5) * bezier(
            vec2f(
                // cos(theta / time + time * 0.0011) * 0.4,
                // sin(theta / time + time * 0.0011) * 0.5,
                flip * cos(rate * 0.5) * 0.25 - 0.66,
                flip * sin(rate * 0.5) * 0.25,
            ),
            vec2f(
                sin(theta + rate) * 0.25 - 0.66,
                cos(theta + rate) * 0.25,
            ),
            vec2f(
                cos(theta + rate * 0.25) * 0.25 - 0.66,
                sin(theta + rate * 0.25) * 0.25,
            ),
            uv,
            0.0025
        );

        color += hsla(0.45, 1, 0.45, 0.1 + t * 0.25) * bezier(
            vec2f(
                // cos(theta / time + time * 0.0011) * 0.4,
                // sin(theta / time + time * 0.0011) * 0.5,
                flip * cos(rate * 0.5) * 0.25,
                flip * sin(rate * 0.5) * 0.25,
            ),
            vec2f(
                sin(theta + rate) * 0.25,
                cos(theta + rate) * 0.25,
            ),
            vec2f(
                cos(theta + rate * 0.25) * 0.25,
                sin(theta + rate * 0.25) * 0.25,
            ),
            uv,
            0.0025
        );
    }

    for (var i = 1; i <= amount; i++) {
        let rate = time * 0.001;
        let theta = tau * f32(i) / f32(amount);
        let flip = sign(f32(i % 2) - 0.5);

        color += hsla(0.5, 0.75, 0.5, 0.25) * line(
            vec2f(
                // cos(theta / time + time * 0.0011) * 0.4,
                // sin(theta / time + time * 0.0011) * 0.5,
                flip * cos(rate * 0.5) * 0.25 + 0.66,
                flip * sin(rate * 0.5) * 0.25,
            ),
            vec2f(
                cos(theta + rate * 0.25) * 0.25 + 0.66,
                sin(theta + rate * 0.25) * 0.25,
            ),
            uv,
            0.0015
        );

        color += hsla(0.45, 1, 0.45, 0.1 + (1 - t) * 0.25) * line(
            vec2f(
                // cos(theta / time + time * 0.0011) * 0.4,
                // sin(theta / time + time * 0.0011) * 0.5,
                flip * cos(rate * 0.5) * 0.25,
                flip * sin(rate * 0.5) * 0.25,
            ),
            vec2f(
                cos(theta + rate * 0.25) * 0.25,
                sin(theta + rate * 0.25) * 0.25,
            ),
            uv,
            0.0015
        );
    }

    return color;
}