import React from "react"

export default () => {
	return (
		<button
			id="pause_button"
			className="menu-item"
			onClick={() => window.pause = !window.pause}
		>Pause</button >
	)
}