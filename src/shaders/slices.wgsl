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

fn arc(
    center: vec2f,
    in_radius: f32,
    thick: f32,
    pos: vec2f,
    start: f32,
    end: f32,
) -> f32 {
    let ring = circle(center, in_radius, thick, pos);
    let s = select(start % tau, tau + (start % tau), start < 0);
    let e = select(end % tau, tau + (end % tau), end < 0);

    let theta = atan2(-pos.y, -pos.x) + pi;

    if e < s {
        if theta > s { return ring; }
        if theta < e { return ring; }
    } else {
        if theta > s && theta < e {
            return ring;
        }
    }

    // if theta >= arc_length { return circle(p1, uv, radius, thickness); }

    // if abs(theta) > arc_length { return 0.5; }

    return 0;
}

fn circle(center: vec2f, in_radius: f32, thick: f32, pos: vec2f) -> f32 {
    if distance(center, pos) < in_radius { return 0; }
    if distance(center, pos) > in_radius + thick { return 0; }

    return 0.5;
}

fn line(p1: vec2f, p2: vec2f, thickness: f32, pos: vec2f) -> f32 {
    if pos.x > p1.x && pos.x < p2.x && pos.y > p1.y && pos.y < p2.y { return 0.5; }

    // let t = saturate(dot(p2 - p1, pos - p1) / dot(p2 - p1, p2 - p1));
    // let p3 = mix(p1, p2, t);

    // let width = step(length(p3 - pos), thickness);
    // let check = select(0.0, 1.0, t >= 0 && t <= 1);

    return 0;
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
    let w = width;
    let h = height;
    let pos = (in.xy / vec2f(width, height)) * 2 - 1;
    let uv = vec2f(pos.x, -pos.y);
    // let uv = vec2f(in.x, height - in.y);

    let a = vec2f(1, aspect);
    let c = cursor * a;

    let p1 = vec2f(0, 0);
    let p2 = vec2f(0.5, 0);
    let p3 = vec2f(0.25, 0.25);

    let center = vec2f(0, 0);

    let amount = 60;
    let slices = 7;

    var color: vec4<f32>;

    for (var i = 1; i <= amount; i++) {

        // let spin = select(
        //     time * 0.0001,
        //     -time * 0.0001,
        //     i % 2 == 0
        // );

        let spin = f32(i) * sign(f32(i) % 2 - 0.5) * time * 0.000005;
        // let spin = f32(i) * time * 0.00001;

        for (var s = 0; s < slices; s++) {
            let gap = 0.5 / f32(amount);

            let slice = tau / f32(slices);

            color += arc(
                center,
                gap * f32(i),
                gap * 0.8,
                uv * a,
                spin + f32(i) * 0.0036 + slice * f32(s),
                spin - f32(i) * 0.0036 + slice * (f32(s) + 0.5),
            ) * hsla(0.5, 1, 1 - sin(pi * f32(i) / f32(amount)) * 0.5, 1);
        }
    }

    // color += arc(
    //     center,
    //     0.5,
    //     0.05,
    //     uv * a,
    //     -time * 0.001,
    //     pi - time * 0.001
    // );

    // let cc = vec2f(
    //     cos(angle),
    //     sin(angle),
    // ) * 0.25;

    return color;
}