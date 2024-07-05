import React, { useEffect, useState } from "react"

const can_pause = [
	"cells",
	"heart",
	"larva",
	"radial",
	"sphere",
	"stare",
	"sun",
	"tree",
]

const icons = {
	pause: {
		label: "| |",
		color: "#c4ffd2"
	},
	play: {
		label: "▶",
		color: "#ffc4c4"
	}
}

const check = () => !window.pause ? "pause" : "play"

export default ({ mode }) => {
	const [label, set_label] = useState(icons.pause.label)

	useEffect(() => {
		set_label(icons[check()].label)
	}, [])

	const handle_pause = () => {
		// if (!can_pause.includes(mode)) return

		window.pause = !window.pause
		set_label(icons[check()].label)
	}

	return (
		<button
			id="pause_button"
			className="menu-item"
			// style={{ color: can_pause.includes(mode) ? icons[check()].color : "gray" }}
			style={{ color: icons[check()].color }}
			onClick={handle_pause}
		>
			{/* {can_pause.includes(mode) ? label : icons.pause.label} */}
			{label}
		</button >
	)
}