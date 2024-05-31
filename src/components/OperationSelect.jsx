import React from "react"

const operations = [
	"source-over",
	"source-in",
	"source-out",
	"source-atop",
	"destination-over",
	"destination-in",
	"destination-out",
	"destination-atop",
	"lighter",
	"copy",
	"xor",
	"multiply",
	"screen",
	"overlay",
	"darken",
	"lighten",
	"color-dodge",
	"color-burn",
	"hard-light",
	"soft-light",
	"difference",
	"exclusion",
	"hue",
	"saturation",
	"color",
	"luminosity"
]

export default () => {
	return (
		<select
			id=""
			className="menu-item"
			// onChange={(event) => set_drawing_mode(event.target.value)}
			// defaultValue={drawing_mode}
		>
			{operations.map((e, i) =>
				<option
					key={i}
					value={e}
				>{e}</option>
			)}
		</select>
	)
}