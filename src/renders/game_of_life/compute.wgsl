@group(0) @binding(0) var<uniform> grid: vec2f;
@group(0) @binding(1) var<storage> cell_state_read: array<u32>;
@group(0) @binding(2) var<storage, read_write> cell_state_write: array<u32>;
@group(0) @binding(4) var<storage, read_write> cell_neighbors_write: array<u32>;

fn cell_index(cell: vec2u) -> u32 {
    return (cell.x % u32(grid.x)) + (cell.y % u32(grid.y)) * u32(grid.x);
}

fn cell_active(x: u32, y: u32) -> u32 {
    return cell_state_read[cell_index(vec2(x, y))];
}

fn count_neighbors(x: u32, y: u32) -> u32 {
    var count = 0u;

    for (var i = 0u; i <= 2; i++) {
        for (var j = 0u; j <= 2; j++) {
            count += cell_active(x + i, y + j);
        }
    }

    return count - cell_active(x + 1, y + 1);
}

fn cell_logic(index: u32, neighbors: u32) -> u32 {
    switch neighbors {
		case 2: { return cell_state_read[index]; }
		case 3: { return 1; }
		default: { return 0; }
	}
}

@compute @workgroup_size(8, 8)
fn compute_main(@builtin(global_invocation_id) cell: vec3u) {
    let active_neighbors = count_neighbors(cell.x - 1, cell.y - 1);
    let index = cell_index(cell.xy);

    cell_state_write[index] = cell_logic(index, active_neighbors);
    cell_neighbors_write[index] = active_neighbors;
}