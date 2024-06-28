import React from "react"

export default ({ reset_count, reset_points, reset_canvas }) => {
	return (
		<button
			id="reset_button"
			className="menu-item"
			onClick={() => {
				reset_count()
				reset_points()
				reset_canvas()
			}}
		>Reset</button>
	)
}