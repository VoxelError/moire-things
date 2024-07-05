export let drawing_mode = JSON.parse(localStorage.getItem("drawing_mode")) ?? "ball"
export const set_drawing_mode = (value) => drawing_mode = value

export const add_point = (x, y, z = 0, w = 0) => window.points.push([x, y, z, w])

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
	canvas.addEventListener("mousedown", (event) => event.button == 0 && (cursor.held = true))
	canvas.addEventListener("mouseup", () => cursor.held = false)
	canvas.addEventListener("mousemove", (event) => {
		cursor.x = event.offsetX
		cursor.y = event.offsetY
	})
	canvas.addEventListener("mouseover", () => cursor.show = true)
	canvas.addEventListener("mouseleave", () => {
		cursor.held = false
		cursor.show = false
	})
	canvas.addEventListener("wheel", (event) => {
		// 	e.preventDefault()
		// 	cursor.size += e.deltaY * 0.1
	})
	canvas.addEventListener("contextmenu", (event) => event.preventDefault())
}