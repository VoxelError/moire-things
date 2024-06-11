import React, { useEffect, useState } from "react"
import { cos, degrees, sin } from "../lib/math"
import { add_point } from "../App.jsx"

const plot_points = (mode) => {
	switch (mode) {
		case "fins": {
			const max = 60

			for (let i = 0; i < max; i++) {
				add_point(
					window.innerWidth / 2 + (250 * cos(degrees(i * 360 / max))),
					window.innerHeight / 2 + (250 * sin(degrees(i * 360 / max))),
					-degrees(i * 360 / max)
				)
			}

			break
		}

		case "spin": {
			for (let i = 0; i < window.innerHeight; i += window.innerHeight / 200) {
				add_point(
					window.innerWidth * 0.6,
					i,
					degrees(i)
				)
			}

			break
		}

		case "squares": {
			for (let i = 1; i <= 25; i++) {
				add_point(0, 0, i / 50, i / 50)
			}

			break
		}

		case "sun": {
			const max = 360

			for (let i = 0; i < max; i++) {
				add_point(
					window.innerWidth / 2 - cos(degrees(i * 360 / max)),
					window.innerHeight / 2 - sin(degrees(i * 360 / max))
				)
			}

			break
		}
	}
}

export default ({ mode }) => {
	const [color, set_color] = useState("gray")

	useEffect(() => {
		const can_plot = ["fins", "spin", "squares", "sun"]
		set_color(can_plot.includes(mode) ? "white" : "gray")
	}, [mode])

	return (
		<button
			id="plot_button"
			className="menu-item"
			style={{ color }}
			onClick={() => plot_points(mode)}
		>Plot</button >
	)
}