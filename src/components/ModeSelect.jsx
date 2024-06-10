import React, { useEffect, useState } from "react"
import { drawing_mode, set_drawing_mode } from "../lib/controls"
import { sign } from "../lib/math"
import { reset_canvas } from "../drawings/_main"

const modes = [
	"ball",
	"bounce",
	"circles",
	"fins",
	"heart",
	"larva",
	"legs",
	"orbs",
	"pendulums",
	"petals",
	"pillar",
	"snake",
	"sphere",
	"spin",
	"stalks",
	"squares",
	"stare",
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

const handle_change = () => {
	window.pause = false
	reset_canvas()

	const pause_button = document.getElementById("pause_button")
	const can_pause = ["heart", "larva", "sphere", "stare", "sun", "tree"]
	pause_button.style.color = can_pause.includes(drawing_mode) ? "white" : "gray"

	const plot_button = document.getElementById("plot_button")
	const can_plot = ["fins", "squares", "sun"]
	plot_button.style.color = can_plot.includes(drawing_mode) ? "white" : "gray"
}

export default () => {
	const [current_mode, set_mode] = useState(drawing_mode)
	useEffect(handle_change)

	return (
		<select
			id="drawing_mode"
			className="menu-item"
			value={current_mode}
			style={{ color: !view_only.includes(current_mode) ? "#c4ffd2" : "#ffc4c4" }}
			onWheel={(event) => {
				const scroll = modes[modes.indexOf(current_mode) + sign(event.deltaY)]
				set_mode(scroll)
				set_drawing_mode(scroll)
				handle_change()
			}}
			onChange={(event) => {
				set_mode(event.target.value)
				set_drawing_mode(event.target.value)
				handle_change()
			}}
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