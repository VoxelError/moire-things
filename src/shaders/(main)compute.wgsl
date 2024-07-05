@group(0) @binding(0) var<uniform> grid: vec2f;
@group(0) @binding(1) var<storage> cell_state_read: array<u32>;
@group(0) @binding(2) var<storage, read_write> cell_state_write: array<u32>;

fn cell_index(cell: vec2u) -> u32 {
    return (cell.x % u32(grid.x)) + (cell.y % u32(grid.y)) * u32(grid.x);
}

@compute @workgroup_size(8, 8)
fn compute_main(@builtin(global_invocation_id) cell: vec3u) {
    cell_state_write[cell_index(cell.xy)] = cell_state_read[cell_index(vec2u(cell.x - 1, cell.y))];
}