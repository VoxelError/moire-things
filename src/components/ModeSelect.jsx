import React from "react"
import { drawing_mode, set_drawing_mode } from "../lib/controls"

const modes = [
	"Bounce",
	"Circles",
	"Fins",
	"Heart",
	"Larva",
	"Legs",
	"Orbs",
	"Pendulums",
	"Petals",
	// "Pillar",
	"Snake",
	"Sphere",
	"Spin",
	"Stalks",
	"Squares",
	"Stare",
	"Sun",
	"Trails",
	"Tree",
	"Twirls",
]

export default () => {
	return (
		<select
			id="drawing_mode"
			className="menu-item"
			onChange={(event) => {
				set_drawing_mode(event.target.value)

				const plot_button = document.getElementById("plot_button")
				switch (drawing_mode) {
					case "Fins": plot_button.style.color = "white"; break
					case "Squares": plot_button.style.color = "white"; break
					case "Sun": plot_button.style.color = "white"; break
					default: plot_button.style.color = "gray"; break
				}
			}}
			defaultValue={drawing_mode}
		>
			{modes.map((e, i) =>
				<option
					key={i}
					value={e}
				>{e}</option>
			)}
		</select>
	)
}