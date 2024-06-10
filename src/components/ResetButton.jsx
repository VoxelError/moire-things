import React from "react"
import { reset_canvas, reset_count, reset_points } from "../drawings/_main"

export default () => {
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