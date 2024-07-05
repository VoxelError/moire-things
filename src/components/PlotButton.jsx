import React, { useEffect, useState } from "react"
import { cos, degrees, sin, tau } from "../util/math.js"
import { add_point } from "../util/controls.js"

const plot_points = (mode) => {
	switch (mode) {
		case "fins": {
			const max = 60
			for (let i = 0; i < max; i++) {
				const ratio = tau * i / max

				add_point(
					window.size.x / 2 + (250 * cos(ratio)),
					window.size.y / 2 + (250 * sin(ratio)),
					-ratio
				)
			} break
		}

		case "spin": {
			for (let i = 0; i < window.size.y; i += window.size.y / 200) {
				add_point(window.size.x * 0.6, i, degrees(i))
			} break
		}

		case "squares": {
			for (let i = 1; i <= 25; i++) {
				add_point(0, 0, i / 50, i / 50)
			} break
		}

		case "sun": {
			const max = 360
			for (let i = 0; i < max; i++) {
				const ratio = tau * i / max
				add_point(
					window.size.x / 2 - cos(ratio),
					window.size.y / 2 - sin(ratio)
				)
			} break
		}
	}
}

export default ({ mode }) => {
	const [color, set_color] = useState("gray")

	const can_plot = ["fins", "spin", "squares", "sun"]
	useEffect(() => set_color(can_plot.includes(mode) ? "white" : "gray"), [mode])

	return (
		<button
			id="plot_button"
			className="menu-item"
			style={{ color }}
			onClick={() => plot_points(mode)}
		>Plot</button >
	)
}