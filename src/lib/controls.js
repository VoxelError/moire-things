import { add_point } from "../drawings/_main"
import { cos, degrees, random, rng, sin } from "./math"

export let drawing_mode = JSON.parse(localStorage.getItem("drawing_mode")) ?? "Bounce"
export const set_drawing_mode = (value) => drawing_mode = value

export const cursor = {
	x: -100,
	y: -100,
	r: 0,
	delta: 0,
	held: false,
	show: true,
	size: 66,
}

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
		case "Heart": break
		case "Larva": break
		case "Sphere": break
		case "Stare": break

		// case "Fins": add_point(cursor.x, cursor.y, 0, 150); break
		case "Fins": add_point(cursor.x, cursor.y, 0, rng(100, 50)); break
		case "Orbs": add_point(cursor.x, cursor.y - 150); break
		case "Squares": add_point(cursor.x, cursor.y, 1, 1); break
		case "Stalks": add_point(cursor.x, cursor.y, 0, random() * 360); break
		// case 7: add_point(cursor.x, cursor.y, 0, 1); break
		// case "Petals": {
		// 	add_point(cursor.x, cursor.y)
		// 	cursor.held = false
		// 	break
		// }
		default: add_point(cursor.x, cursor.y, 0, 0)
	}
}

export const plot_points = () => {
	switch (drawing_mode) {
		case "Fins": {
			const max = 60
			const center = {
				x: window.innerWidth / 2,
				y: window.innerHeight / 2
			}

			for (let i = 0; i < max; i++) {
				add_point(
					center.x + (250 * cos(degrees(i * 360 / max))),
					center.y + (250 * sin(degrees(i * 360 / max))),
					-degrees(i * 360 / max)
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
					window.innerWidth / 2 - cos(degrees(i * 360 / max)),
					window.innerHeight / 2 - sin(degrees(i * 360 / max))
				)
			}

			break
		}
	}

	// const skip = (frames) => !(count % frames)

	// count < width / 10 ? add_point(count * 10, height - (count ** 1.325)) : cursor.plot = false
	// count <= 45 && add_point(sin_wave(degrees(count * 10), width / 4, width / 2, degrees(45)), (count * 10) + 250)
	// count < height / 2 && skip(5) && add_point(width / 2, height * 0.75 - count)
	// count < width / 4 && skip(5) && add_point(width - count * 4, 0)
	// count < 200 && skip(10) && add_point(width / 2, height / 2)
	// count < 100 && skip(10) && add_point(center.x, center.y - count, 0, count + 200)7
	// count < height && skip(10) && add_point(width / 2 + count, count)

	// for (let i = 0; i < 66; i++) { add_point(width / 2, height / 2 + i * 5, 0, i * 5 + 150) }
}