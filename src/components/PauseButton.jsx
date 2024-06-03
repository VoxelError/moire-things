import React, { useState } from "react"

export default () => {
	const [label, set_label] = useState("Pause")

	return (
		<button
			id="pause_button"
			className="menu-item"
			onClick={() => {
				window.pause = !window.pause
				set_label(window.pause ? "Play" : "Pause")
			}}
		>
			{label}
		</button >
	)
}