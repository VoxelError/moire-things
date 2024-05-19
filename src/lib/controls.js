import { add_point, height, width } from "../drawings/_main"
import { cos, degrees, sin } from "./math"

export let drawing_mode = JSON.parse(localStorage.getItem("drawing_mode")) ?? "Bounce"

export const cursor = {
	x: -100,
	y: -100,
	r: 0,
	delta: 0,
	held: false,
	show: true,
	size: 66,
}

const dropdown = document.getElementById("drawing_mode")
dropdown.addEventListener("change", (event) => drawing_mode = event.target.value)

const canvas = document.getElementById("game_canvas")
canvas.addEventListener("mouseleave", () => {
	cursor.held = false
	cursor.show = false
})
canvas.addEventListener("mouseover", () => cursor.show = true)

document.addEventListener("mousedown", (event) => {
	if (event.target.id !== "game_canvas") return
	event.button == 0 && (cursor.held = true)
})
document.addEventListener("mouseup", () => cursor.held = false)
document.addEventListener("mousemove", (event) => {
	cursor.x = event.pageX
	cursor.y = event.pageY
})
document.addEventListener("wheel", (event) => {
	// 	e.preventDefault()
	// 	cursor.size += e.deltaY * 0.1
})

export const draw_points = () => {
	if (!cursor.held) return

	switch (drawing_mode) {
		case "Larva": break
		case "Heart": break
		case "Orbs": add_point(cursor.x, cursor.y - 150); break
		case "Squares": add_point(cursor.x, cursor.y, 1, 1); break
		// case 7: add_point(cursor.x, cursor.y, 0, 1); break
		case "Eyes": {
			add_point(cursor.x, cursor.y)
			cursor.held = false
			break
		}
		default: add_point(cursor.x, cursor.y)
	}
}

export const plot_points = () => {
	switch (drawing_mode) {
		case "Fins": {
			const max = 90

			for (let i = 0; i < max; i++) {
				add_point(
					width / 2 + (250 * cos(degrees(i))),
					height / 2 + (250 * sin(degrees(i))),
					-degrees(i)
				)
			}

			break
		}

		case "Squares": {
			for (let i = 1; i <= 25; i++) {
				add_point(0, 0, i / 50, i / 50)
			}

			break
		}

		case "Sun": {
			const max = 360

			for (let i = 0; i < max; i++) {
				add_point(
					width / 2 - cos(degrees(i * 360 / max)),
					height / 2 - sin(degrees(i * 360 / max))
				)
			}

			break
		}
	}

	// count < width / 10 ? add_point(count * 10, height - (count ** 1.325)) : cursor.plot = false
	// count <= 45 && add_point(sin_wave(degrees(count * 10), width / 4, width / 2, degrees(45)), (count * 10) + 250)
	// count < height / 2 && skip(5) && add_point(width / 2, height * 0.75 - count)
	// count < width / 4 && skip(5) && add_point(width - count * 4, 0)
	// count < 200 && skip(10) && add_point(width / 2, height / 2)
	// count < 100 && skip(10) && add_point(center.x, center.y - count, 0, count + 200)7
	// count < height && skip(10) && add_point(width / 2 + count, count)

	// for (let i = 0; i < 66; i++) { add_point(width / 2, height / 2 + i * 5, 0, i * 5 + 150) }
}