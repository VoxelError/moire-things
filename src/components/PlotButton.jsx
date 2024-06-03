import React, { useEffect } from "react"
import { drawing_mode } from "../lib/controls"
import { add_point } from "../drawings/_main"
import { cos, degrees, sin } from "../lib/math"

const plot_points = () => {
	switch (drawing_mode) {
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

export default () => {
	return (
		<button
			id="plot_button"
			className="menu-item"
			onClick={() => plot_points()}
		>Plot</button >
	)
}