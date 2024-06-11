import { add_point } from "../drawings/_main"
import { rng } from "./math"

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
		// case "ball": add_point(cursor.x, cursor.y); break
		case "heart": break
		case "larva": break
		case "orbs": add_point(cursor.x, cursor.y + 150); break
		case "sphere": break
		case "squares": add_point(cursor.x, cursor.y, 1, 1); break
		// case "stalks": add_point(cursor.x, cursor.y, 0, rng(360)); break
		case "stare": break
		default: add_point(cursor.x, cursor.y, 0, 0)
	}
}