import { add_point } from "../App.jsx"

export let drawing_mode = JSON.parse(localStorage.getItem("drawing_mode")) ?? "ball"
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

export const listen = (canvas) => {
	canvas.addEventListener("mouseleave", () => {
		cursor.held = false
		cursor.show = false
	})
	canvas.addEventListener("mouseover", () => cursor.show = true)
	canvas.addEventListener("mousedown", (event) => {
		if (event.target.id !== "game_canvas") return
		event.button == 0 && (cursor.held = true)
	})
	canvas.addEventListener("mouseup", () => cursor.held = false)
	canvas.addEventListener("mousemove", (event) => {
		cursor.x = event.offsetX
		cursor.y = event.offsetY
	})
	canvas.addEventListener("wheel", (event) => {
		// 	e.preventDefault()
		// 	cursor.size += e.deltaY * 0.1
	})
	canvas.addEventListener("contextmenu", (event) => event.preventDefault())
}

export const draw_points = () => {
	if (!cursor.held) return
	switch (drawing_mode) {
		case "heart":
		case "larva":
		case "sphere":
		case "stare": break

		case "squares": add_point(cursor.x, cursor.y, 1, 1); break
		default: add_point(cursor.x, cursor.y)
	}
}