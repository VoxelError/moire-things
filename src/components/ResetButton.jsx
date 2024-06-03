import React from "react"
import { reset_all } from "../drawings/_main"

export default () => {
	return (
		<button
			id="reset_button"
			className="menu-item"
			onClick={() => reset_all()}
		>Reset</button>
	)
}