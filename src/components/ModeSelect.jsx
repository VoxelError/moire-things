import React from "react"
import { sign } from "../lib/math"

const modes = [
	"ball",
	"bounce",
	"cells",
	"circles",
	"fins",
	"heart",
	"larva",
	"legs",
	"orbs",
	"pendulums",
	"petals",
	"pillar",
	"radial",
	"snake",
	// "speed",
	"sphere",
	"spin",
	"squares",
	"stalks",
	"stare",
	// "stereo",
	"sun",
	"trails",
	"tree",
	"twirls",
]

const view_only = [
	"heart",
	"larva",
	"sphere",
	"stare",
	"tree"
]

export default ({ mode, handle_change }) => {
	return (
		<select
			id="drawing_mode"
			className="menu-item"
			value={mode}
			style={{ color: !view_only.includes(mode) ? "#c4ffd2" : "#ffc4c4" }}
			onChange={(event) => handle_change(event.target.value)}
			onWheel={(event) => handle_change(modes[modes.indexOf(mode) + sign(event.deltaY)])}
		>
			{modes.map((mode, index) => (
				<option
					key={index}
					value={mode}
					style={{ color: !view_only.includes(mode) ? "#c4ffd2" : "#ffc4c4" }}
				>
					{mode.charAt(0).toUpperCase() + mode.slice(1)}
				</option>
			))}
		</select>
	)
}