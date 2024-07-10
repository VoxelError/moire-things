import { cos, sin, tau } from "./math.js"

export const plot_points = (mode, size, points, count) => {
	switch (mode) {
		case "fins": {
			const max = 60
			for (let i = 0; i < max; i++) {
				const ratio = tau * i / max

				points.push({
					x: size.x / 2 + (250 * cos(ratio)),
					y: size.y / 2 + (250 * sin(ratio)),
					theta: -ratio,
					length: size.y / 10,
				})
			} break
		}

		case "spin": {
			for (let i = 0; i < size.y; i += size.y / 200) {
				points.push({
					x: size.x * 0.1,
					y: i,
					delta: count + i
				})
			} break
		}

		case "squares": {
			for (let i = 1; i <= 25; i++) {
				points.push({
					x: 0,
					y: 0,
					vx: i / 50,
					vy: i / 50,
				})
			} break
		}

		case "sun": {
			const max = 360
			for (let i = 0; i < max; i++) {
				const ratio = tau * i / max
				points.push({
					x: size.x / 2 - cos(ratio),
					y: size.y / 2 - sin(ratio),
				})
			} break
		}
	}
}