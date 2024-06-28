import React from "react"
import { sign } from "../util/math"
import { entries } from "../util/modes"

const options = Object.keys(entries)

const view_only = [
	"heart",
	"larva",
	"pillar",
	"radial",
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
			onWheel={(event) => handle_change(options.at((options.indexOf(mode) + sign(event.deltaY)) % options.length))}
		>
			{options.map((mode, index) => (
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