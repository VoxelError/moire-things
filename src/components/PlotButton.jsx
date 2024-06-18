import React, { useEffect, useState } from "react"
import { cos, degrees, sin, tau } from "../lib/math"
import { add_point } from "../App.jsx"

const plot_points = (mode) => {
	switch (mode) {
		case "fins": {
			const max = 60

			for (let i = 0; i < max; i++) {
				const ratio = tau * i / max

				add_point(
					window.innerWidth / 2 + (250 * cos(ratio)),
					window.innerHeight / 2 + (250 * sin(ratio)),
					-ratio
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
					window.innerWidth / 2 - cos(tau * i / max),
					window.innerHeight / 2 - sin(tau * i / max)
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