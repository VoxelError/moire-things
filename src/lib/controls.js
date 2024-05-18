import { add_point, cursor, height, width } from "../drawings/_main"
import { cos, degrees, sin } from "./math"

export let drawing_mode = JSON.parse(localStorage.getItem("draw_mode")) ?? 1

const dropdown = document.getElementById("drawing_mode")

const modes = [
	"Larva",
	"Pendulums",
	"Fins",
	"Orbs",
	"Circles",
	"Eyes",
	"Spin",
	"Bounce",
	"Snake",
	"Squares",
	"Legs",
	"Heart",
	"Twirls",
	"Sun",
	"Sphere",
]

modes.forEach((mode) => {
	dropdown.innerHTML += `<option value="${mode}">${mode}</option>`
})

dropdown.addEventListener("mouseover", () => {
	cursor.menu = true
	cursor.held = false
	dropdown.style.borderColor = "white"
})
dropdown.addEventListener("mouseleave", () => {
	cursor.menu = false
	dropdown.style.borderColor = "grey"
})
dropdown.addEventListener("change", (event) => {
	drawing_mode = event.target.value
	localStorage.setItem("draw_mode", JSON.stringify(drawing_mode))
})
document.addEventListener("keydown", (event) => {
	event.code == "KeyE" && (cursor.plot = true)
})
document.addEventListener("mousedown", (e) => {
	e.button == 0 && cursor.menu == false && (cursor.held = true)
	cursor.pin.x = e.pageX
	cursor.pin.y = e.pageY
	// console.log(cursor.pin)
})
document.addEventListener("mouseup", (e) => {
	cursor.held = false
})
document.addEventListener("mousemove", (e) => {
	cursor.x = e.pageX
	cursor.y = e.pageY
})
document.addEventListener("wheel", (e) => {
	// 	e.preventDefault()
	// 	cursor.size += e.deltaY * 0.1
})

export const draw_points = () => {
	if (!cursor.held) return

	if (drawing_mode == 0) return

	if (drawing_mode == 3) {
		add_point(cursor.x, cursor.y - 150)
		return
	}

	if (drawing_mode == 5) {
		add_point(cursor.x, cursor.y)
		cursor.held = false
		return
	}

	if (drawing_mode == 7) {
		add_point(cursor.x, cursor.y, 0, 1)
		return
	}

	if (drawing_mode == 9) {
		add_point(cursor.x, cursor.y, 1, 1)
		return
	}

	add_point(cursor.x, cursor.y)
}

export const plot_points = () => {
	switch (drawing_mode) {
		case "Larva": {
			for (let i = 0; i < 6; i++) {
				add_point(width / 2, height / 2)
			}
			break
		}
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
	}

	if (drawing_mode == "Squares") {
		for (let i = 1; i <= 25; i++) {
			add_point(0, 0, i / 50, i / 50)
		}
	}

	if (drawing_mode == "Sun") {
		const max = 360

		for (let i = 0; i < max; i++) {
			add_point(
				width / 2 - cos(degrees(i * 360 / max)),
				height / 2 - sin(degrees(i * 360 / max))
			)
		}
	}

	cursor.plot = false

	// count < width / 10 ? add_point(count * 10, height - (count ** 1.325)) : cursor.plot = false
	// count <= 45 && add_point(sin_wave(degrees(count * 10), width / 4, width / 2, degrees(45)), (count * 10) + 250)
	// count < height / 2 && skip(5) && add_point(width / 2, height * 0.75 - count)
	// count < width / 4 && skip(5) && add_point(width - count * 4, 0)
	// count < 200 && skip(10) && add_point(width / 2, height / 2)
	// count < 100 && skip(10) && add_point(center.x, center.y - count, 0, count + 200)7
	// count < height && skip(10) && add_point(width / 2 + count, count)

	// for (let i = 0; i < 66; i++) { add_point(width / 2, height / 2 + i * 5, 0, i * 5 + 150) }
}