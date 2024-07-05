struct VertexInput {
	@location(0) pos: vec2f,
	@builtin(instance_index) instance: u32,
};

struct VertexOutput {
	@builtin(position) pos: vec4f,
	@location(0) cell: vec2f,
	@location(1) @interpolate(flat) alive: u32,
};

@group(0) @binding(0) var<uniform> grid: vec2f;
@group(0) @binding(1) var<storage> cell_state: array<u32>;

@vertex
fn vertex_main(input: VertexInput) -> VertexOutput {
    let i = f32(input.instance);
    let pos = input.pos;
    let cell = vec2f(i % grid.x, floor(i / grid.x)) - grid / 2;
    let align = ((input.pos + (cell + 0.5) * 2)) / grid;

    var output: VertexOutput;
    output.pos = vec4f(align, 0, 1);
    output.cell = cell;
    output.alive = cell_state[input.instance];

    return output;
}

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
    let cell = input.cell;
    let alive = input.alive;
    let pos = input.pos;
    let ratio = cell.x / grid.x;

    if alive == 1 {
        return vec4f(ratio, 0, (1 - ratio) * 0.5, 1);
    }
    return vec4f(0, 0, 0, 1);

	// return vec4f(cell.x * f32(alive) / grid.x, 0, 0, 1);
}