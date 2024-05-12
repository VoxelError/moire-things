import { createSlice } from "@reduxjs/toolkit"

export const count_slice = createSlice({
	name: 'count',
	initialState: 0,
	reducers: {
		increment: (state) => state++,
		reset: (state) => state = 0
	}
})

export const { increment, reset } = count_slice.actions

export default count_slice.reducer