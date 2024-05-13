import { createSlice } from "@reduxjs/toolkit"

export const points_slice = createSlice({
	name: 'points',
	initialState: [],
	reducers: {
		add_point: (state) => state++,
		clear_points: (state) => state = 0
	}
})

export const { add_point, clear_points } = points_slice.actions

export default points_slice.reducer