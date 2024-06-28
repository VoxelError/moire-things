struct VertexInput {
	@location(0) pos: vec2f,
	@builtin(instance_index) instance: u32,
};

struct VertexOutput {
	@builtin(position) pos: vec4f,
	@location(0) cell: vec2f,
	@location(1) @interpolate(flat) alive: u32,
	@location(2) @interpolate(flat) neighbors: u32,
};

@group(0) @binding(0) var<uniform> grid: vec2f;
@group(0) @binding(1) var<storage> cell_state: array<u32>;
@group(0) @binding(3) var<storage> cell_neighbors: array<u32>;

fn cell_index(cell: vec2u) -> u32 {
    return (cell.x % u32(grid.x)) + (cell.y % u32(grid.y)) * u32(grid.x);
}

@vertex
fn vertex_main(input: VertexInput) -> VertexOutput {
    let i = f32(input.instance);
    let cell = vec2f(i % grid.x, floor(i / grid.x));
    let scale = f32(cell_neighbors[input.instance]) / 8;
	// let align = (input.pos * scale + cell * 2 + 1) / grid - 1;
    let align = (input.pos + cell * 2 + 1) / grid - 1;

    var output: VertexOutput;
    output.pos = vec4f(align, 0, 1);
    output.cell = cell;
    output.alive = cell_state[input.instance];
    output.neighbors = cell_neighbors[input.instance];

    return output;
}

@fragment
fn fragment_main(input: VertexOutput) -> @location(0) vec4f {
    let cell = input.cell;
    let neighbors = input.neighbors;
    let alive = input.alive;

    let ratio = f32(neighbors) / 8;
    let color = vec3f(ratio, 0, 0);

    return vec4f(color, 1);
	// return vec4f(f32(alive), f32(alive), f32(alive), 1);
}