import React, { useEffect, useState } from "react"

const can_pause = [
	"heart",
	"larva",
	"radial",
	"sphere",
	"stare",
	"sun",
	"tree",
]

const pause_icon = "| |"
const play_icon = "▶"

export default ({ mode }) => {
	const [label, set_label] = useState(pause_icon)

	useEffect(() => set_label(pause_icon), [mode])

	const handle_pause = () => {
		if (!can_pause.includes(mode)) return

		window.pause = !window.pause
		set_label(window.pause ? play_icon : pause_icon)
	}

	const handle_color = () => {
		if (!can_pause.includes(mode)) return "gray"
		return label == play_icon ? "#ffc4c4" : "#c4ffd2"
	}

	return (
		<button
			id="pause_button"
			className="menu-item"
			style={{ color: handle_color() }}
			onClick={handle_pause}
		>
			{label}
		</button >
	)
}