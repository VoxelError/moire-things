export default /* wgsl */`

struct VertexOut {
	@builtin(position) pos: vec4f,
	@location(0) tex: vec2f,
}

struct Camera {
	matrix: mat4x4f,
}

@group(0) @binding(0) var samp: sampler;
@group(0) @binding(1) var texture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> cam: Camera;

@vertex
fn vertex_main(@builtin(vertex_index) index: u32) -> VertexOut {
    let pos = array(
        vec2f(0.0, 0.0),
        vec2f(1.0, 0.0),
        vec2f(0.0, 1.0),
        vec2f(0.0, 1.0),
        vec2f(1.0, 0.0),
        vec2f(1.0, 1.0),
    );

    var out: VertexOut;
    out.pos = cam.matrix * vec4f(pos[index], 0.0, 1.0);
    out.tex = pos[index] * vec2f(1, 50);
    return out;
}

@fragment
fn fragment_main(in: VertexOut) -> @location(0) vec4f {
    return textureSample(texture, samp, in.tex);
}

`